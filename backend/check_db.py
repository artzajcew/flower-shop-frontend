# check_db.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.category import Category
from app.models.product import Product

print("=" * 50)
print("Проверка подключения к базе данных flower_shop_db")
print("=" * 50)

try:
    db = SessionLocal()

    # Проверяем пользователей
    users = db.query(User).all()
    print(f"\n📊 Пользователи: {len(users)}")
    for user in users:
        print(f"   - {user.id}: {user.name} ({user.email or 'нет email'}) admin={user.is_admin}")

    # Проверяем категории
    categories = db.query(Category).all()
    print(f"\n📊 Категории: {len(categories)}")
    for cat in categories:
        print(f"   - {cat.id}: {cat.name}")

    # Проверяем товары
    products = db.query(Product).all()
    print(f"\n📊 Товары: {len(products)}")
    for prod in products[:5]:  # Первые 5
        print(f"   - {prod.id}: {prod.name[:50]}... {prod.price}₽")
    if len(products) > 5:
        print(f"   ... и еще {len(products) - 5} товаров")

    db.close()
    print("\n✅ Подключение работает отлично!")

except Exception as e:
    print(f"\n❌ Ошибка: {e}")