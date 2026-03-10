# app/models/order.py
from sqlalchemy import Column, Integer, Numeric, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    delivery_date = Column(DateTime, nullable=False)
    delivery_address = Column(Text, nullable=False)
    recipient_name = Column(String(255), nullable=False)
    recipient_phone = Column(String(20), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False, default=0)
    status = Column(String(50), nullable=False, default="Новый")

    # Связи
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")