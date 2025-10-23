# Backend для Inventory Checker

REST API сервер для работы с Steam Web API.

## Установка

```bash
npm install
```

## Настройка

1. Получите Steam API ключ: https://steamcommunity.com/dev/apikey
2. Создайте файл `.env`:
```
PORT=3000
STEAM_API_KEY=ваш_ключ_здесь
```

## Запуск

### Разработка
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

## API Endpoints

### Поиск пользователя
**GET** `/api/search-users/:username`

Ответ:
```json
{
  "success": true,
  "users": [
    {
      "steamid": "76561198123456789",
      "personaname": "Player Name",
      "avatarmedium": "https://...",
      "personastate": 1
    }
  ]
}
```

### Получение информации о пользователе
**GET** `/api/user/:steamId`

### Получение списка игр
**GET** `/api/user-games/:steamId`

### Получение инвентаря
**GET** `/api/inventory/:steamId/:appId?contextId=2`

### Получение цены предмета
**GET** `/api/item-price/:appId/:marketHashName`

## Развертывание на сервере

Для продакшн развертывания рекомендуется использовать:
- PM2 для управления процессом
- Nginx как reverse proxy
- HTTPS сертификат

```bash
# Установка PM2
npm install -g pm2

# Запуск с PM2
pm2 start server.js --name inventory-checker-api
pm2 save
pm2 startup
```

