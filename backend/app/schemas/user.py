# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    name: str = Field(..., description="Имя пользователя")
    email: Optional[EmailStr] = Field(None, description="Email")
    phone: Optional[str] = Field(None, description="Телефон")


class UserCreate(UserBase):
    password: str = Field(..., description="Пароль", min_length=4)


class UserRead(UserBase):
    id: int
    is_admin: bool
    last_login_date: Optional[datetime]

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str = Field(..., description="Email или логин")
    password: str = Field(..., description="Пароль")