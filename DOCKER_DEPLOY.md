# 🐳 Развертывание с Docker на сервере

## 📋 Ваша конфигурация

- **Сервер**: `91.236.198.205` (Linux)
- **GitHub**: https://github.com/mashka818/inventory
- **Docker контейнер**: ✅ Готов к развертыванию

---

## 🚀 Быстрое развертывание (5 минут)

### Шаг 1: Подключитесь к серверу

```bash
ssh user@91.236.198.205
```

### Шаг 2: Установите Docker и Docker Compose

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER

# Установите Docker Compose
sudo apt install docker-compose -y

# Проверьте установку
docker --version
docker-compose --version

# Перезайдите в систему для применения прав
exit
```

После выхода снова подключитесь к серверу.

### Шаг 3: Клонируйте репозиторий

```bash
# Клонируйте проект
git clone https://github.com/mashka818/inventory.git
cd inventory
```

### Шаг 4: Настройте переменные окружения

```bash
# Создайте .env файл в папке backend
nano backend/.env
```

Добавьте:
```env
PORT=3000
STEAM_API_KEY=02A2F2A03EF7E760581C39DB53BCD95F
NODE_ENV=production
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

### Шаг 5: Запустите контейнер

```bash
# Соберите и запустите контейнер
docker-compose up -d

# Посмотрите логи
docker-compose logs -f
```

### Шаг 6: Проверьте работу

```bash
# Проверьте статус контейнера
docker-compose ps

# Проверьте API
curl http://localhost:3000/api/search-users/gaben

# Или с другого компьютера
curl http://91.236.198.205:3000/api/search-users/gaben
```

### Шаг 7: Откройте порт в firewall

```bash
# Для Ubuntu/Debian
sudo ufw allow 3000/tcp
sudo ufw status

# Для CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## ✅ Готово!

Ваш backend запущен в Docker контейнере и доступен по адресу:
```
http://91.236.198.205:3000
```

Проверьте в браузере:
```
http://91.236.198.205:3000/api/search-users/gaben
```

---

## 📊 Управление контейнером

### Основные команды Docker Compose:

```bash
# Запуск контейнера
docker-compose up -d

# Остановка контейнера
docker-compose down

# Перезапуск контейнера
docker-compose restart

# Просмотр логов
docker-compose logs -f

# Просмотр статуса
docker-compose ps

# Пересборка образа
docker-compose build --no-cache

# Пересборка и запуск
docker-compose up -d --build
```

### Основные команды Docker:

```bash
# Список запущенных контейнеров
docker ps

# Список всех контейнеров
docker ps -a

# Логи конкретного контейнера
docker logs inventory-checker-api

# Следить за логами в реальном времени
docker logs -f inventory-checker-api

# Войти в контейнер
docker exec -it inventory-checker-api sh

# Удалить остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune
```

---

## 🔄 Обновление приложения

### Когда вы обновили код на GitHub:

```bash
# Подключитесь к серверу
ssh user@91.236.198.205
cd inventory

# Остановите контейнер
docker-compose down

# Получите обновления
git pull origin main

# Пересоберите и запустите
docker-compose up -d --build

# Проверьте логи
docker-compose logs -f
```

---

## 🔒 Настройка HTTPS с Nginx (рекомендуется)

### Установите Nginx:

```bash
sudo apt install nginx -y
```

### Создайте конфигурацию:

```bash
sudo nano /etc/nginx/sites-available/inventory-checker
```

Добавьте:
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/inventory-checker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Теперь API будет доступен на порту 80:
```
http://91.236.198.205/api/search-users/gaben
```

### Если есть домен - настройте SSL:

```bash
# Установите Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получите SSL сертификат
sudo certbot --nginx -d yourdomain.com

# Автопродление сертификата
sudo certbot renew --dry-run
```

---

## 📈 Мониторинг и логи

### Просмотр логов:

```bash
# Логи в реальном времени
docker-compose logs -f

# Последние 100 строк
docker-compose logs --tail=100

# Логи конкретного сервиса
docker-compose logs -f inventory-backend
```

### Статистика контейнера:

```bash
# Использование ресурсов
docker stats inventory-checker-api

# Детальная информация о контейнере
docker inspect inventory-checker-api
```

### Health check:

```bash
# Проверка здоровья контейнера
docker inspect --format='{{.State.Health.Status}}' inventory-checker-api
```

---

## 🐛 Устранение проблем

### Контейнер не запускается:

```bash
# Проверьте логи
docker-compose logs

# Проверьте, не занят ли порт
sudo netstat -tlnp | grep 3000

# Пересоберите контейнер
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### API не отвечает:

```bash
# Проверьте статус контейнера
docker-compose ps

# Проверьте логи ошибок
docker-compose logs | grep -i error

# Войдите в контейнер и проверьте
docker exec -it inventory-checker-api sh
wget -O- http://localhost:3000/api/search-users/gaben
```

### Проблемы с портами:

```bash
# Найдите процесс на порту 3000
sudo lsof -i :3000

# Убейте процесс (замените PID)
sudo kill -9 PID
```

### Ошибки с правами:

```bash
# Убедитесь, что пользователь в группе docker
groups $USER

# Если нет, добавьте
sudo usermod -aG docker $USER
# Перезайдите в систему
```

---

## 🔧 Оптимизация для продакшена

### 1. Настройте автозапуск Docker:

```bash
sudo systemctl enable docker
```

### 2. Ограничьте ресурсы контейнера:

Обновите `docker-compose.yml`:
```yaml
services:
  inventory-backend:
    # ... остальные настройки
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          memory: 256M
```

### 3. Настройте логирование:

```yaml
services:
  inventory-backend:
    # ... остальные настройки
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 4. Используйте .env файл:

Создайте `.env` в корне проекта:
```env
STEAM_API_KEY=02A2F2A03EF7E760581C39DB53BCD95F
PORT=3000
NODE_ENV=production
```

---

## 🔐 Безопасность

### 1. Смените Steam API ключ после настройки:

https://steamcommunity.com/dev/apikey

### 2. Настройте firewall:

```bash
# Разрешите только нужные порты
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 3. Регулярно обновляйте систему:

```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 📱 Обновите мобильное приложение

После развертывания backend в Docker, приложение уже настроено на:
```
http://91.236.198.205:3000
```

Просто запустите мобильное приложение:
```bash
cd mobile
npm install
npm run android
```

---

## ✨ Готово!

Ваш backend запущен в Docker контейнере на сервере `91.236.198.205`.

### Проверочный список:

- ✅ Docker установлен
- ✅ Репозиторий склонирован
- ✅ .env файл настроен
- ✅ Контейнер запущен
- ✅ Порт 3000 открыт
- ✅ API работает
- ✅ Мобильное приложение подключено

### Полезные ссылки:

- GitHub: https://github.com/mashka818/inventory
- API: http://91.236.198.205:3000
- Тест: http://91.236.198.205:3000/api/search-users/gaben

---

## 📞 Команды для быстрого доступа

```bash
# Подключение к серверу
ssh user@91.236.198.205

# Переход в проект
cd inventory

# Просмотр логов
docker-compose logs -f

# Перезапуск
docker-compose restart

# Обновление
git pull && docker-compose up -d --build
```

---

Удачи! 🚀 Если возникнут проблемы, смотрите раздел "Устранение проблем" выше.

