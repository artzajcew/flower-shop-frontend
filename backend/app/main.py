# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import products, auth, categories, orders  # ← добавил orders
from app.core.database import engine, Base

# Создаем таблицы в базе данных (если их еще нет)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Flower Shop API",
    description="API для управления цветочным магазином",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(products.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")  # ← добавил эту строку


@app.get("/")
def root():
    return {
        "message": "Добро пожаловать в API цветочного магазина!",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "database": "connected to flower_shop_db"}