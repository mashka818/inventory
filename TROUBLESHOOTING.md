# 🔧 Решение проблем

## Проблемы с Backend

### Сервер не запускается

**Ошибка: "Error: Cannot find module 'express'"**
```bash
cd backend
npm install
```

**Ошибка: "Error: listen EADDRINUSE: address already in use :::3000"**

Порт 3000 уже занят. Измените порт в `.env`:
```
PORT=3001
```

И обновите URL в `mobile/src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://10.0.2.2:3001';
```

**Ошибка: "Steam API key is not set"**

Убедитесь, что файл `backend/.env` существует и содержит:
```
STEAM_API_KEY=ваш_ключ
```

### API возвращает ошибки

**403 Forbidden**
- Проверьте правильность Steam API ключа
- Убедитесь, что не превышен лимит запросов

**Profile is private**
- Профиль или инвентарь пользователя приватный
- Пользователь должен открыть настройки приватности в Steam

---

## Проблемы с Mobile App

### Установка зависимостей

**Ошибка при npm install**
```bash
# Очистите кэш
npm cache clean --force
rm -rf node_modules package-lock.json

# Переустановите
npm install
```

**Ошибка: "Unable to resolve module"**
```bash
# Сбросьте кэш Metro
npm start -- --reset-cache
```

### Проблемы с Android

**Ошибка: "SDK location not found"**

Создайте файл `mobile/android/local.properties`:
```properties
sdk.dir=C:\\Users\\ВашеИмя\\AppData\\Local\\Android\\Sdk
```

**Ошибка: "JAVA_HOME is not set"**

Установите переменную окружения:
```
JAVA_HOME=C:\Program Files\Java\jdk-17
```

**Ошибка: "Execution failed for task ':app:installDebug'"**

```bash
# Проверьте подключенные устройства
adb devices

# Если список пуст, перезапустите ADB
adb kill-server
adb start-server
```

**Приложение не устанавливается на устройство**

1. Убедитесь, что USB отладка включена
2. Разрешите установку с компьютера
3. Попробуйте другой USB кабель/порт

```bash
# Переустановите приложение
adb uninstall com.inventorychecker
npm run android
```

### Ошибки сборки

**"Gradle build failed"**

```bash
cd mobile/android
./gradlew clean
cd ../..

# Очистите кэш Gradle (Windows)
rmdir /s /q %USERPROFILE%\.gradle\caches

npm run android
```

**"Task ':app:processDebugResources' failed"**

Проверьте наличие всех необходимых файлов ресурсов в `mobile/android/app/src/main/res/`

**"Duplicate resources"**

```bash
cd mobile/android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### Metro Bundler

**"Cannot connect to Metro"**

```bash
# Убедитесь, что Metro запущен
npm start

# Если не помогает, сбросьте кэш
npm start -- --reset-cache
```

**"Transform error"**

```bash
watchman watch-del-all
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Подключение к Backend

**"Network request failed"**

**Для эмулятора:**
- IP должен быть `10.0.2.2:3000`
- Backend должен быть запущен

**Для реального устройства:**
1. Убедитесь, что устройство и ПК в одной сети
2. Узнайте IP компьютера:
   ```bash
   # Windows
   ipconfig
   # Найдите IPv4 адрес
   ```
3. Обновите `mobile/src/config/api.js`:
   ```javascript
   export const API_BASE_URL = 'http://192.168.X.X:3000';
   ```
4. Убедитесь, что firewall не блокирует порт 3000

**"Unable to resolve host"**

Проверьте подключение к интернету и правильность URL.

---

## Проблемы со Steam API

### "User not found"

- Проверьте правильность написания ника
- Убедитесь, что профиль публичный
- Некоторые пользователи используют Steam ID вместо custom URL

### "Inventory is empty or private"

1. Откройте профиль Steam
2. Настройки приватности → Инвентарь
3. Установите "Публичный"

### "Price not available"

- Предмет не продается на торговой площадке
- Предмет слишком редкий/нет продаж
- Steam Market временно недоступен

---

## Общие проблемы

### Медленная работа

**Backend слишком медленный:**
- Steam API может быть перегружен
- Проверьте интернет-соединение
- Рассмотрите кеширование ответов

**Приложение тормозит:**
- Попробуйте release сборку вместо debug
- Проверьте, не слишком ли большой инвентарь
- Оптимизируйте изображения

### Приложение крашится

**Проверьте логи:**

```bash
# Android
adb logcat | grep -i "inventorychecker"

# Или в React Native
npx react-native log-android
```

**Общие причины:**
- Отсутствуют обязательные поля в данных
- Ошибка парсинга JSON
- Нехватка памяти (слишком много предметов)

**Решение:**
1. Добавьте обработку ошибок
2. Проверяйте данные перед использованием
3. Ограничьте количество отображаемых предметов

---

## Windows специфичные проблемы

### PowerShell Execution Policy

Если скрипты не выполняются:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Длинные пути

Если ошибки с длинными путями:
```bash
# В реестре включите long paths
# Или используйте короткие пути для проекта
```

### Антивирус блокирует

Добавьте папку проекта в исключения антивируса.

---

## Полезные команды

### Очистка проекта

```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Mobile
cd mobile
rm -rf node_modules
npm install

# Android
cd mobile/android
./gradlew clean
cd ../..
```

### Полная перезагрузка

```bash
# Остановите все процессы
# Удалите приложение с устройства
adb uninstall com.inventorychecker

# Очистите кэши
npm start -- --reset-cache
watchman watch-del-all

# Пересоберите
cd mobile/android
./gradlew clean
cd ../..
npm run android
```

### Проверка окружения

```bash
# Node.js версия
node --version  # должно быть >= 18

# npm версия
npm --version

# Java версия
java -version  # должно быть JDK 17

# Android SDK
echo %ANDROID_HOME%

# ADB
adb version
```

---

## Получение помощи

Если проблема не решена:

1. **Проверьте логи:**
   - Backend: console вывод
   - Android: `adb logcat`
   - React Native: DevTools

2. **Воспроизведите проблему:**
   - Опишите шаги
   - Сделайте скриншоты
   - Сохраните логи ошибок

3. **Поищите решение:**
   - GitHub Issues
   - Stack Overflow
   - React Native сообщество

4. **Создайте issue:**
   - Опишите проблему
   - Приложите логи
   - Укажите версии ПО

---

## Профилактика проблем

1. **Регулярно обновляйте зависимости:**
   ```bash
   npm update
   ```

2. **Используйте фиксированные версии** в package.json

3. **Тестируйте на разных устройствах**

4. **Делайте backup проекта**

5. **Используйте систему контроля версий (Git)**

---

## Контакты для поддержки

- **React Native**: https://reactnative.dev/help
- **Steam API**: https://steamcommunity.com/dev
- **Android**: https://developer.android.com/support

Удачи в разработке! 🚀

