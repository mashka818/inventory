#!/bin/bash
# Скрипт для обновления бэкенда на сервере

echo "🔄 Обновление бэкенда..."

cd /root/inventory

# Останавливаем контейнеры
docker-compose down

# Получаем последние изменения
git pull origin back

# Пересобираем и запускаем
docker-compose up -d --build

# Показываем логи
echo "📋 Логи сервера:"
docker-compose logs --tail=20 inventory-backend

echo "✅ Обновление завершено!"

