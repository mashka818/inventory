# 🚀 Руководство по развертыванию на сервере 91.236.198.205

## ✅ Ваша конфигурация готова!

- **Сервер**: `91.236.198.205`
- **Порт**: `3000`
- **Steam API ключ**: Настроен ✓

---

## 📦 Шаг 1: Загрузка файлов на сервер

### Вариант A: Через SFTP/FileZilla (проще для Windows)

1. Скачайте [FileZilla](https://filezilla-project.org/)
2. Подключитесь:
   - Хост: `sftp://91.236.198.205`
   - Порт: `22`
   - Пользователь: ваш логин
   - Пароль: ваш пароль

3. Загрузите папку `backend` на сервер в любую директорию, например:
   - `/home/your-user/inventory-checker/backend/`

### Вариант B: Через командную строку (Windows PowerShell)

```powershell
# Перейдите в папку проекта
cd C:\Users\Masha\Desktop\InventoryChecker

# Загрузите backend на сервер
scp -r backend user@91.236.198.205:/home/user/inventory-checker/
```

---

## 🖥️ Шаг 2: Настройка на сервере

### Подключитесь к серверу:

**Через PuTTY (для Windows):**
1. Скачайте [PuTTY](https://www.putty.org/)
2. Host Name: `91.236.198.205`
3. Port: `22`
4. Connection type: `SSH`
5. Нажмите "Open"

**Или через PowerShell:**
```powershell
ssh user@91.236.198.205
```

### Установите Node.js (если не установлен):

```bash
# Проверьте, установлен ли Node.js
node --version

# Если нет, установите (Ubuntu/Debian):
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте установку
node --version  # должно быть >= 18
npm --version
```

### Перейдите в папку backend:

```bash
cd /home/user/inventory-checker/backend
# (замените путь на ваш)
```

### Установите зависимости:

```bash
npm install
```

### Проверьте файл .env:

```bash
cat .env
```

Должно показать:
```
PORT=3000
STEAM_API_KEY=02A2F2A03EF7E760581C39DB53BCD95F
```

Если файла нет, создайте:
```bash
nano .env
```

Вставьте:
```
PORT=3000
STEAM_API_KEY=02A2F2A03EF7E760581C39DB53BCD95F
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## 🚀 Шаг 3: Запуск сервера

### Временный запуск (для теста):

```bash
npm start
```

Вы должны увидеть:
```
Сервер запущен на порту 3000
API доступен по адресу: http://localhost:3000
```

### Проверьте работу:

```bash
# В новом окне терминала (или на вашем ПК)
curl http://91.236.198.205:3000/api/search-users/gaben
```

Должен вернуться JSON с данными пользователя.

---

## 🔥 Шаг 4: Настройка Firewall

### Откройте порт 3000:

```bash
# Ubuntu/Debian с UFW
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw status

# Или если используется iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables-save
```

### Проверьте с вашего ПК:

Откройте в браузере:
```
http://91.236.198.205:3000/api/search-users/gaben
```

---

## ⚡ Шаг 5: Постоянный запуск с PM2

### Установите PM2:

```bash
sudo npm install -g pm2
```

### Запустите сервер:

```bash
pm2 start server.js --name inventory-checker
```

### Настройте автозапуск при перезагрузке:

```bash
pm2 startup
# Скопируйте и выполните команду, которую покажет PM2

pm2 save
```

### Полезные команды PM2:

```bash
pm2 list                    # Список процессов
pm2 logs inventory-checker  # Просмотр логов
pm2 restart inventory-checker  # Перезапуск
pm2 stop inventory-checker     # Остановка
pm2 delete inventory-checker   # Удаление
pm2 monit                   # Мониторинг в реальном времени
```

---

## ✅ Шаг 6: Проверка мобильного приложения

### На вашем ПК (Windows):

```powershell
# Перейдите в папку mobile
cd C:\Users\Masha\Desktop\InventoryChecker\mobile

# Установите зависимости (если еще не установлены)
npm install

# Запустите приложение на Android
npm run android
```

### Тестирование:

1. Откройте приложение на телефоне/эмуляторе
2. Введите ник: `gaben`
3. Нажмите "Найти"
4. Должен появиться Gabe Newell с его профилем
5. Выберите игру и просмотрите инвентарь

---

## 🔒 Безопасность (рекомендуется)

### 1. Смените Steam API ключ

После того как все заработает, смените ключ:
1. Зайдите на https://steamcommunity.com/dev/apikey
2. Нажмите "Revoke My Steam Web API Key"
3. Создайте новый ключ
4. Обновите `.env` на сервере:
   ```bash
   nano /home/user/inventory-checker/backend/.env
   # Измените STEAM_API_KEY на новый
   pm2 restart inventory-checker
   ```

### 2. Настройте базовую защиту

```bash
# Ограничьте доступ к .env файлу
chmod 600 .env

# Установите fail2ban для защиты от брутфорса SSH
sudo apt install fail2ban
```

### 3. Рассмотрите использование HTTPS

Для продакшена рекомендуется настроить:
- Nginx как reverse proxy
- SSL сертификат (Let's Encrypt - бесплатно)

---

## 🐛 Устранение проблем

### Backend не запускается:

```bash
# Проверьте логи
pm2 logs inventory-checker

# Проверьте, свободен ли порт 3000
sudo netstat -tlnp | grep 3000

# Проверьте файл .env
cat .env
```

### API не отвечает извне:

```bash
# Проверьте firewall
sudo ufw status

# Проверьте, слушает ли сервер на всех интерфейсах
netstat -tlnp | grep 3000
# Должно быть: 0.0.0.0:3000 или :::3000
```

Если показывает `127.0.0.1:3000`, измените в `server.js`:
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
```

### Приложение не подключается:

1. Проверьте backend: `curl http://91.236.198.205:3000/api/search-users/gaben`
2. Проверьте файл: `mobile/src/config/api.js` (должен быть `http://91.236.198.205:3000`)
3. Убедитесь, что телефон имеет интернет

---

## 📊 Мониторинг

### Просмотр в реальном времени:

```bash
pm2 monit
```

### Логи:

```bash
pm2 logs inventory-checker --lines 100
```

### Статус:

```bash
pm2 status
```

---

## 🔄 Обновление приложения

### Обновить backend на сервере:

```bash
cd /home/user/inventory-checker/backend
# Загрузите новые файлы (через SFTP/SCP)
npm install
pm2 restart inventory-checker
```

### Обновить mobile:

```bash
cd C:\Users\Masha\Desktop\InventoryChecker\mobile
npm install
npm run android
```

---

## 📞 Быстрая справка

### Команды на сервере:

```bash
# Перезапуск
pm2 restart inventory-checker

# Логи
pm2 logs inventory-checker

# Статус
pm2 status

# Остановка
pm2 stop inventory-checker

# Запуск
pm2 start server.js --name inventory-checker
```

### Команды на ПК:

```bash
# Запуск Metro Bundler
cd mobile
npm start

# Запуск на Android
npm run android

# Сборка APK
cd android
./gradlew assembleRelease
```

---

## 🎉 Готово!

Ваше приложение должно работать:

1. ✅ Backend на `http://91.236.198.205:3000`
2. ✅ Mobile приложение подключается к серверу
3. ✅ Steam API ключ настроен

**Следующие шаги:**
- Протестируйте все функции
- Соберите APK для публикации (см. `PUBLISH_GUIDE.md`)
- Опубликуйте в RuStore или Google Play

---

**Вопросы?** Смотрите `TROUBLESHOOTING.md`

Удачи! 🚀

