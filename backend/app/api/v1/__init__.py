# app/api/v1/__init__.py
from fastapi import APIRouter

from app.api.v1 import products, auth, categories, orders

router = APIRouter(prefix="/api/v1")

router.include_router(products.router)
router.include_router(auth.router)
router.include_router(categories.router)
router.include_router(orders.router)