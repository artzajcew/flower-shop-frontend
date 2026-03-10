# app/models/category.py
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from ..core.database import Base


class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    # Связи
    products = relationship("Product", back_populates="category")