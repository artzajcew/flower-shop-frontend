# app/models/product.py
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, Date, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    import_date = Column(Date, server_default=func.current_date())
    freshness_date = Column(Date, nullable=True)
    image_url = Column(String(500), nullable=True)

    # Связи
    category = relationship("Category", back_populates="products")