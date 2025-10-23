# 🐳 Inventory Checker Backend - Server Deployment

Backend сервер для мобильного приложения Inventory Checker в Docker контейнере.

## 🚀 Быстрое развертывание

### Требования
- Linux сервер (Ubuntu/Debian/CentOS)
- Docker и Docker Compose

### Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/mashka818/inventory.git
cd inventory

# 2. Создайте .env файл
nano backend/.env
```

Добавьте в `backend/.env`:
```env
PORT=3000
STEAM_API_KEY=ваш_steam_api_ключ
NODE_ENV=production
```

```bash
# 3. Запустите Docker контейнер
docker-compose up -d

# 4. Откройте порт в firewall
sudo ufw allow 3000/tcp

# 5. Проверьте работу
curl http://localhost:3000/api/search-users/gaben
```

## 📖 Полная документация

Смотрите **DOCKER_DEPLOY.md** для детальных инструкций.

## 🔧 Управление

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Логи
docker-compose logs -f

# Обновление
git pull && docker-compose up -d --build
```

## 📡 API Endpoints

- `GET /api/search-users/:username` - Поиск пользователей Steam
- `GET /api/user/:steamId` - Информация о пользователе
- `GET /api/user-games/:steamId` - Список игр
- `GET /api/inventory/:steamId/:appId` - Инвентарь игры
- `GET /api/item-price/:appId/:marketHashName` - Цена предмета

## 🔗 Ссылки

- **GitHub**: https://github.com/mashka818/inventory
- **Steam API**: https://steamcommunity.com/dev/apikey

## 📄 Лицензия

MIT License - см. LICENSE

