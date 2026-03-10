# app/api/v1/products.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.database import get_db
from app.models.product import Product
from app.schemas.product import ProductRead, ProductCreate, ProductUpdate

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get("/", response_model=List[ProductRead])
def get_products(
    db: Session = Depends(get_db),
    category_id: Optional[int] = Query(None, description="Фильтр по категории"),
    min_price: Optional[float] = Query(None, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, description="Максимальная цена"),
    in_stock: Optional[bool] = Query(None, description="Только в наличии"),
    search: Optional[str] = Query(None, description="Поиск по названию"),
    skip: int = Query(0, ge=0, description="Сколько пропустить"),
    limit: int = Query(100, ge=1, le=1000, description="Сколько вернуть")
):
    """
    Получить список всех товаров с фильтрацией
    """
    query = db.query(Product)

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if in_stock:
        query = query.filter(Product.quantity > 0)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductRead)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о конкретном товаре
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Товар с id {product_id} не найден"
        )
    return product


@router.post("/", response_model=ProductRead, status_code=201)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
    # TODO: добавить проверку прав администратора
):
    """
    Создать новый товар (только для администратора)
    """
    # Проверяем, есть ли товар с таким артикулом
    if product_data.code:
        existing = db.query(Product).filter(Product.code == product_data.code).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Товар с таким артикулом уже существует"
            )

    product = Product(**product_data.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
    # TODO: добавить проверку прав администратора
):
    """
    Изменить информацию о товаре
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Товар с id {product_id} не найден"
        )

    update_data = product_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
    # TODO: добавить проверку прав администратора
):
    """
    Удалить товар
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Товар с id {product_id} не найден"
        )

    db.delete(product)
    db.commit()
    return None