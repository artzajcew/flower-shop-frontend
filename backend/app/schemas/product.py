# app/schemas/product.py
from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional
from datetime import date, datetime


class ProductBase(BaseModel):
    name: str = Field(..., description="Название товара")
    code: Optional[str] = Field(None, description="Артикул")
    description: Optional[str] = Field(None, description="Описание товара")
    price: Decimal = Field(..., gt=0, description="Цена")
    quantity: int = Field(..., ge=0, description="Количество на складе")
    category_id: int = Field(..., description="ID категории")
    freshness_date: Optional[date] = Field(None, description="Срок свежести до")
    image_url: Optional[str] = Field(None, description="Ссылка на фото")


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    quantity: Optional[int] = None
    category_id: Optional[int] = None
    freshness_date: Optional[date] = None
    image_url: Optional[str] = None


class ProductRead(ProductBase):
    id: int
    import_date: date

    class Config:
        from_attributes = True