# app/models/goods_baskets.py
from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from ..core.database import Base


class GoodsBaskets(Base):
    __tablename__ = "goods_baskets"

    good_id = Column(Integer, ForeignKey("products.id"), primary_key=True)
    basket_id = Column(Integer, ForeignKey("basket.id"), primary_key=True)
    count = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    # Связи
    basket = relationship("Basket", back_populates="items")
    product = relationship("Product")