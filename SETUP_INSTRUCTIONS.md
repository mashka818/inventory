# 🚀 Инструкции по настройке для вашего сервера

## Ваша конфигурация:
- **IP сервера**: `91.236.198.205`
- **Порт backend**: `3000`
- **API URL**: `http://91.236.198.205:3000`

---

## 📋 Шаг 1: Настройка Backend на сервере

### Подключитесь к серверу:
```bash
ssh user@91.236.198.205
```

### Установите Node.js (если еще не установлен):
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте установку
node --version
npm --version
```

### Загрузите backend на сервер:

**Вариант 1: Через Git**
```bash
cd /home/your-user/
git clone https://github.com/your-repo/inventory-checker.git
cd inventory-checker/backend
```

**Вариант 2: Загрузите файлы через SFTP/SCP**
```bash
# На вашем локальном ПК
scp -r backend/* user@91.236.198.205:/path/to/backend/
```

### Настройте backend:
```bash
cd backend
npm install

# Создайте файл .env
nano .env
```

Добавьте в `.env`:
```
PORT=3000
STEAM_API_KEY=ваш_steam_api_ключ
```

Сохраните (Ctrl+O, Enter, Ctrl+X)

### Запустите backend:

**Временно (для теста):**
```bash
npm start
```

**Постоянно (рекомендуется - с PM2):**
```bash
# Установите PM2
sudo npm install -g pm2

# Запустите сервер
pm2 start server.js --name inventory-checker-api

# Автозапуск при перезагрузке
pm2 startup
pm2 save

# Полезные команды PM2:
pm2 status              # Статус
pm2 logs                # Логи
pm2 restart inventory-checker-api   # Перезапуск
pm2 stop inventory-checker-api      # Остановка
```

### Проверьте, что сервер работает:
```bash
# На сервере
curl http://localhost:3000/api/search-users/gaben

# Или с другого компьютера
curl http://91.236.198.205:3000/api/search-users/gaben
```

---

## 🔥 Шаг 2: Настройка Firewall

Откройте порт 3000 на сервере:

### Ubuntu/Debian (ufw):
```bash
sudo ufw allow 3000/tcp
sudo ufw status
```

### CentOS/RHEL (firewalld):
```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### Проверьте порт:
```bash
sudo netstat -tlnp | grep 3000
# Должно показать, что порт 3000 слушается
```

---

## 📱 Шаг 3: Мобильное приложение

Конфигурация уже обновлена в файле `mobile/src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://91.236.198.205:3000';
```

### Запустите приложение:
```bash
cd mobile
npm install
npm run android
```

---

## ✅ Проверка работоспособности

### 1. Проверьте backend:
Откройте в браузере:
```
http://91.236.198.205:3000/api/search-users/gaben
```

Должен вернуть JSON с данными пользователя.

### 2. Проверьте приложение:
- Откройте приложение на телефоне
- Введите ник: `gaben`
- Нажмите "Найти"
- Должен появиться пользователь Gabe Newell

---

## 🔒 Рекомендации по безопасности

### 1. Используйте HTTPS (рекомендуется для продакшена)

Установите Nginx + Let's Encrypt:

```bash
# Установите Nginx
sudo apt install nginx

# Установите Certbot
sudo apt install certbot python3-certbot-nginx

# Получите SSL сертификат (нужен домен!)
sudo certbot --nginx -d yourdomain.com
```

Конфигурация Nginx (`/etc/nginx/sites-available/inventory-checker`):
```nginx
server {
    listen 80;
    server_name 91.236.198.205;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/inventory-checker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Ограничьте rate limiting

В `server.js` добавьте:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов
});

app.use(limiter);
```

### 3. Используйте переменные окружения

Никогда не коммитьте файл `.env` с секретными ключами!

---

## 🐛 Устранение проблем

### Backend не отвечает:
```bash
# Проверьте, запущен ли процесс
pm2 status

# Проверьте логи
pm2 logs

# Проверьте порт
sudo netstat -tlnp | grep 3000
```

### Приложение не подключается:
1. Проверьте, что backend работает: `curl http://91.236.198.205:3000/api/search-users/gaben`
2. Проверьте firewall на сервере
3. Убедитесь, что в `mobile/src/config/api.js` правильный IP
4. Проверьте интернет-соединение на телефоне

### Ошибка CORS:
В `backend/server.js` убедитесь, что CORS включен:
```javascript
app.use(cors());
```

---

## 📊 Мониторинг

### Просмотр логов:
```bash
pm2 logs inventory-checker-api
```

### Статистика:
```bash
pm2 monit
```

### Автоматический перезапуск при ошибках:
PM2 автоматически перезапускает приложение при сбоях.

---

## 🔄 Обновление приложения

### Обновление backend:
```bash
cd backend
git pull  # если используете Git
npm install
pm2 restart inventory-checker-api
```

### Обновление mobile:
```bash
cd mobile
git pull
npm install
npm run android
```

---

## 📞 Полезные команды

### Проверка статуса сервера:
```bash
pm2 status
pm2 logs
curl http://localhost:3000/api/search-users/gaben
```

### Перезапуск:
```bash
pm2 restart inventory-checker-api
```

### Остановка:
```bash
pm2 stop inventory-checker-api
```

### Удаление из PM2:
```bash
pm2 delete inventory-checker-api
```

---

## 🎯 Что дальше?

1. ✅ Backend развернут на `91.236.198.205:3000`
2. ✅ Мобильное приложение настроено
3. 🔄 Протестируйте все функции
4. 🔒 Настройте HTTPS (опционально, но рекомендуется)
5. 📱 Соберите APK и опубликуйте в RuStore/Google Play

---

Удачи! 🚀

