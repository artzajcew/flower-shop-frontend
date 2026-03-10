# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Список админов с их паролями
ADMIN_CREDENTIALS = {
    "evh": "meoow",
    "art": "meoow",
    "yow": "meoow"
}


@router.post("/register", response_model=UserRead)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Регистрация нового пользователя
    """
    # Проверяем, не занят ли email
    if user_data.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Пользователь с таким email уже существует"
            )

    # Проверяем, не занят ли телефон
    if user_data.phone:
        existing_phone = db.query(User).filter(User.phone == user_data.phone).first()
        if existing_phone:
            raise HTTPException(
                status_code=400,
                detail="Пользователь с таким телефоном уже существует"
            )

    # Проверяем, не пытается ли кто-то зарегистрироваться с админским логином
    if user_data.email and user_data.email in ADMIN_CREDENTIALS:
        raise HTTPException(
            status_code=400,
            detail="Этот логин зарезервирован для администраторов"
        )

    # Создаем нового пользователя
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=user_data.password,  # Временное решение
        is_admin=False
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Вход в систему
    """
    # Сначала проверяем, не админ ли это
    if form_data.username in ADMIN_CREDENTIALS:
        if form_data.password == ADMIN_CREDENTIALS[form_data.username]:
            # Обновляем last_login_date для админа
            admin = db.query(User).filter(User.email == form_data.username).first()
            if admin:
                admin.last_login_date = datetime.now()
                db.commit()

            return {
                "access_token": f"admin_token_{form_data.username}",
                "token_type": "bearer",
                "is_admin": True,
                "username": form_data.username,
                "message": "Добро пожаловать, администратор!"
            }
        else:
            raise HTTPException(
                status_code=401,
                detail="Неверный пароль для администратора"
            )

    # Если не админ, ищем в базе обычных пользователей
    user = db.query(User).filter(
        (User.email == form_data.username) | (User.phone == form_data.username)
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Пользователь не найден"
        )

    # Проверяем пароль
    if user.password != form_data.password:
        raise HTTPException(
            status_code=401,
            detail="Неверный пароль"
        )

    # Обновляем дату последнего входа
    user.last_login_date = datetime.now()
    db.commit()

    # Возвращаем токен для обычного пользователя
    return {
        "access_token": f"user_token_{user.id}",
        "token_type": "bearer",
        "is_admin": False,
        "username": user.email or user.phone,
        "user_id": user.id,
        "message": "Добро пожаловать!"
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.get("/me")
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Получить информацию о текущем пользователе по токену
    """
    if token.startswith("admin_token_"):
        username = token.replace("admin_token_", "")
        admin = db.query(User).filter(User.email == username).first()
        if admin:
            return {
                "id": admin.id,
                "username": username,
                "name": admin.name,
                "is_admin": True
            }
        return {
            "username": username,
            "is_admin": True
        }
    elif token.startswith("user_token_"):
        user_id = int(token.replace("user_token_", ""))
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Пользователь не найден"
            )
        return {
            "id": user.id,
            "username": user.email or user.phone,
            "name": user.name,
            "is_admin": False
        }
    else:
        raise HTTPException(
            status_code=401,
            detail="Недействительный токен"
        )