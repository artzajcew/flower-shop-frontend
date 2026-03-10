# app/api/v1/categories.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.get("/", response_model=List[CategoryRead])
def get_categories(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Сколько пропустить"),
    limit: int = Query(100, ge=1, le=1000, description="Сколько вернуть")
):
    """
    Получить список всех категорий
    """
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """
    Получить детальную информацию о категории
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail=f"Категория с id {category_id} не найдена"
        )
    return category


@router.post("/", response_model=CategoryRead, status_code=201)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db)
    # TODO: добавить проверку прав администратора
):
    """
    Создать новую категорию (только для администратора)
    """
    # Проверяем, есть ли категория с таким названием
    existing = db.query(Category).filter(Category.name == category_data.name).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Категория с таким названием уже существует"
        )

    category = Category(**category_data.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db)
    # TODO: добавить проверку прав администратора
):
    """
    Изменить информацию о категории
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail=f"Категория с id {category_id} не найдена"
        )

    # Если меняется название, проверяем, не занято ли оно
    if category_data.name and category_data.name != category.name:
        existing = db.query(Category).filter(Category.name == category_data.name).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Категория с таким названием уже существует"
            )

    update_data = category_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
    # TODO: добавить проверку прав администратора
):
    """
    Удалить категорию (только для администратора)

    Важно: при удалении категории все товары в ней останутся,
    но у них будет category_id = NULL? Нет, в модели Product
    поле category_id nullable=False, поэтому сначала нужно
    перенести товары в другую категорию или удалить их
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail=f"Категория с id {category_id} не найдена"
        )

    # Проверяем, есть ли товары в этой категории
    from app.models.product import Product
    products_count = db.query(Product).filter(Product.category_id == category_id).count()
    if products_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Нельзя удалить категорию, в которой есть товары ({products_count} шт.). Сначала переместите товары в другую категорию"
        )

    db.delete(category)
    db.commit()
    return None