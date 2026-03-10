# app/models/order_item.py
from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from ..core.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    order_id = Column(Integer, ForeignKey("orders.id"), primary_key=True)
    good_id = Column(Integer, ForeignKey("products.id"), primary_key=True)
    count = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    # Связи
    order = relationship("Order", back_populates="items")
    product = relationship("Product")