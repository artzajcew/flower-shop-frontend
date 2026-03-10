# app/models/basket.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base


class Basket(Base):
    __tablename__ = "basket"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="active")

    # Связи
    user = relationship("User", back_populates="baskets")
    items = relationship("GoodsBaskets", back_populates="basket", cascade="all, delete")