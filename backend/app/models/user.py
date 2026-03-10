# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    last_login_date = Column(DateTime(timezone=True), nullable=True)
    is_admin = Column(Boolean, default=False)
    # created_at - удаляем, так как в таблице этого поля нет

    # Связи
    orders = relationship("Order", back_populates="user")
    baskets = relationship("Basket", back_populates="user")