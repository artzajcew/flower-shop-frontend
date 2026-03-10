# app/schemas/category.py
from pydantic import BaseModel, Field
from typing import Optional


class CategoryBase(BaseModel):
    name: str = Field(..., description="Название категории")
    description: Optional[str] = Field(None, description="Описание")


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, description="Название категории")
    description: Optional[str] = Field(None, description="Описание")


class CategoryRead(CategoryBase):
    id: int

    class Config:
        from_attributes = True