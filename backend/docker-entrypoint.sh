#!/bin/sh
set -e

# Проверка наличия необходимых переменных окружения
if [ -z "$STEAM_API_KEY" ]; then
    echo "ERROR: STEAM_API_KEY is not set!"
    exit 1
fi

echo "Starting Inventory Checker Backend..."
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"

# Запуск приложения
exec npm start

