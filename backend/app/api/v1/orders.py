# app/api/v1/orders.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from app.core.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, OrderRead, OrderUpdate
from app.api.v1.auth import get_current_user

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/", response_model=OrderRead, status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Создать новый заказ (только для авторизованных пользователей)
    """
    # Проверяем, что пользователь существует в БД
    user = db.query(User).filter(User.id == current_user.get("id")).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Пользователь не найден"
        )

    # Получаем ID всех товаров из заказа
    good_ids = [item.good_id for item in order_data.items]

    # Загружаем все товары из БД одним запросом
    products = db.query(Product).filter(Product.id.in_(good_ids)).all()
    products_dict = {p.id: p for p in products}

    # Проверяем наличие всех товаров и достаточное количество
    for item in order_data.items:
        product = products_dict.get(item.good_id)
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Товар с id {item.good_id} не найден"
            )
        if product.quantity < item.count:
            raise HTTPException(
                status_code=400,
                detail=f"Товар '{product.name}' доступен только в количестве {product.quantity}"
            )

    # Считаем общую сумму заказа
    total_price = Decimal(0)
    for item in order_data.items:
        product = products_dict[item.good_id]
        total_price += product.price * item.count

    # Создаем заказ
    db_order = Order(
        user_id=user.id,
        delivery_date=order_data.delivery_date,
        delivery_address=order_data.delivery_address,
        recipient_name=order_data.recipient_name,
        recipient_phone=order_data.recipient_phone,
        total_price=total_price,
        status="Новый"
    )
    db.add(db_order)
    db.flush()  # Чтобы получить id заказа

    # Создаем элементы заказа и уменьшаем количество товаров
    order_items = []
    for item in order_data.items:
        product = products_dict[item.good_id]

        # Создаем запись в order_items
        order_item = OrderItem(
            order_id=db_order.id,
            good_id=item.good_id,
            count=item.count,
            price=product.price
        )
        order_items.append(order_item)

        # Уменьшаем количество товара на складе
        product.quantity -= item.count

    db.add_all(order_items)
    db.commit()
    db.refresh(db_order)

    # Загружаем заказ с товарами для ответа
    result = db.query(Order).filter(Order.id == db_order.id).first()
    return result


@router.get("/", response_model=List[OrderRead])
def get_orders(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Сколько пропустить"),
    limit: int = Query(100, ge=1, le=1000, description="Сколько вернуть"),
    status: Optional[str] = Query(None, description="Фильтр по статусу")
):
    """
    Получить список заказов.
    Админ видит все заказы, обычный пользователь - только свои
    """
    query = db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product))

    # Если не админ, показываем только свои заказы
    if not current_user.get("is_admin", False):
        user = db.query(User).filter(User.id == current_user.get("id")).first()
        if not user:
            raise HTTPException(status_code=401, detail="Пользователь не найден")
        query = query.filter(Order.user_id == user.id)

    # Фильтр по статусу
    if status:
        query = query.filter(Order.status == status)

    # Сортировка по дате (сначала новые)
    query = query.order_by(Order.order_date.desc())

    orders = query.offset(skip).limit(limit).all()

    # Добавляем названия товаров для удобства фронта
    for order in orders:
        for item in order.items:
            if item.product:
                item.product_name = item.product.name

    return orders


@router.get("/{order_id}", response_model=OrderRead)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Получить детальную информацию о заказе
    """
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail=f"Заказ с id {order_id} не найден"
        )

    # Проверяем права доступа
    if not current_user.get("is_admin", False) and order.user_id != current_user.get("id"):
        raise HTTPException(
            status_code=403,
            detail="Нет доступа к этому заказу"
        )

    # Добавляем названия товаров
    for item in order.items:
        if item.product:
            item.product_name = item.product.name

    return order


@router.patch("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    status_data: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Изменить статус заказа (только для администратора)
    """
    # Проверяем, что пользователь - админ
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403,
            detail="Только администратор может изменять статус заказа"
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=404,
            detail=f"Заказ с id {order_id} не найден"
        )

    # Допустимые статусы
    valid_statuses = ["Новый", "В сборке", "Доставляется", "Выполнен", "Отменен"]
    if status_data.status and status_data.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Статус должен быть одним из: {', '.join(valid_statuses)}"
        )

    # Обновляем только статус
    if status_data.status:
        order.status = status_data.status

    db.commit()
    db.refresh(order)

    return order