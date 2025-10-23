# Inventory Checker - Приложение для проверки инвентаря Steam

Мобильное приложение для Android, которое позволяет просматривать инвентарь пользователей Steam и узнавать цены предметов.

## 📱 Функционал

- 🔍 Поиск пользователей Steam по нику
- 👤 Просмотр профиля пользователя
- 🎮 Просмотр списка игр пользователя
- 📦 Просмотр инвентаря игр (CS:GO, Dota 2, TF2, PUBG, Rust и др.)
- 💰 Отображение цен предметов с торговой площадки Steam
- 🎨 Красивый интерфейс в стиле Steam
- 📱 Адаптивный дизайн для мобильных устройств

## 🛠 Технологии

### Backend
- Node.js
- Express
- Axios
- Steam Web API

### Mobile (Android)
- React Native
- React Navigation
- Axios

## 📋 Требования

### Для бэкенда
- Node.js >= 18.x
- npm или yarn

### Для мобильного приложения
- Node.js >= 18.x
- Java Development Kit (JDK) 17
- Android Studio
- Android SDK
- React Native CLI

## 🚀 Установка и запуск

### 1. Получение Steam API ключа

1. Перейдите на https://steamcommunity.com/dev/apikey
2. Войдите в свой аккаунт Steam
3. Заполните форму и получите API ключ
4. Скопируйте полученный ключ

### 2. Настройка бэкенда

```bash
# Перейдите в папку backend
cd backend

# Установите зависимости
npm install

# Создайте файл .env из примера
copy .env.example .env

# Откройте файл .env и добавьте ваш Steam API ключ
# STEAM_API_KEY=ваш_ключ_здесь

# Запустите сервер
npm start
```

Сервер запустится на http://localhost:3000

Для разработки с автоперезагрузкой:
```bash
npm run dev
```

### 3. Настройка мобильного приложения

```bash
# Перейдите в папку mobile
cd mobile

# Установите зависимости
npm install
```

### 4. Настройка Android окружения

1. Установите Android Studio
2. Откройте Android Studio и установите Android SDK (API Level 34)
3. Настройте переменные окружения:
   ```
   ANDROID_HOME=C:\Users\ВашеИмя\AppData\Local\Android\Sdk
   ```
4. Добавьте в PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   ```

### 5. Запуск приложения

#### Для эмулятора:

```bash
# Запустите Metro Bundler в одном терминале
npm start

# В другом терминале запустите приложение
npm run android
```

#### Для реального устройства:

1. Включите режим разработчика на Android устройстве
2. Включите отладку по USB
3. Подключите устройство к компьютеру
4. Убедитесь, что устройство видно: `adb devices`
5. В файле `mobile/src/config/api.js` замените:
   ```javascript
   export const API_BASE_URL = 'http://IP_ВАШЕГО_КОМПЬЮТЕРА:3000';
   ```
6. Запустите приложение: `npm run android`

## 🔧 Конфигурация

### Настройка адреса сервера

Откройте файл `mobile/src/config/api.js`:

- Для эмулятора Android: `http://10.0.2.2:3000`
- Для iOS эмулятора: `http://localhost:3000`
- Для реального устройства: `http://IP_ВАШЕГО_ПК:3000`

## 📦 Сборка APK для публикации

### Debug версия (для тестирования)

```bash
cd mobile/android
./gradlew assembleDebug
```

APK будет находиться в: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

### Release версия (для публикации)

1. Создайте keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Поместите keystore в `mobile/android/app/`

3. Создайте файл `mobile/android/gradle.properties` и добавьте:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

4. Соберите APK:
```bash
cd mobile/android
./gradlew assembleRelease
```

APK будет в: `mobile/android/app/build/outputs/apk/release/app-release.apk`

## 📱 Публикация приложения

### RuStore

1. Зарегистрируйтесь на https://console.rustore.ru/
2. Создайте новое приложение
3. Загрузите APK файл
4. Заполните описание, скриншоты и другую информацию
5. Отправьте на модерацию

### Google Play Store

1. Зарегистрируйтесь в Google Play Console (единоразовый платеж $25)
2. Создайте новое приложение
3. Загрузите AAB файл (вместо APK):
   ```bash
   cd mobile/android
   ./gradlew bundleRelease
   ```
4. Заполните все необходимые данные
5. Отправьте на модерацию

## 📖 API Endpoints

### Поиск пользователя
```
GET /api/search-users/:username
```

### Получение информации о пользователе
```
GET /api/user/:steamId
```

### Получение списка игр
```
GET /api/user-games/:steamId
```

### Получение инвентаря
```
GET /api/inventory/:steamId/:appId?contextId=2
```

### Получение цены предмета
```
GET /api/item-price/:appId/:marketHashName
```

## 🎮 Поддерживаемые игры

- Counter-Strike: Global Offensive (730)
- Dota 2 (570)
- Team Fortress 2 (440)
- PUBG (578080)
- Rust (252490)

## ⚠️ Ограничения

- Для работы приложения требуется публичный профиль Steam
- Для просмотра инвентаря он также должен быть публичным
- Steam API имеет лимиты на количество запросов
- Цены берутся с торговой площадки Steam и могут быть недоступны для некоторых предметов

## 🐛 Возможные проблемы

### Ошибка подключения к серверу
- Убедитесь, что бэкенд запущен
- Проверьте правильность IP адреса в `api.js`
- Проверьте, что порт 3000 не занят

### Приложение не запускается
- Убедитесь, что Android SDK установлен
- Проверьте переменные окружения
- Попробуйте очистить кэш: `npm start -- --reset-cache`

### Ошибки при сборке
```bash
cd mobile/android
./gradlew clean
cd ../..
npm start -- --reset-cache
```

## 📄 Лицензия

Этот проект создан в образовательных целях.

## 👨‍💻 Автор

Создано для демонстрации работы с Steam API и React Native.

## 🔗 Полезные ссылки

- [Steam Web API Documentation](https://developer.valvesoftware.com/wiki/Steam_Web_API)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Android Developer Guide](https://developer.android.com/)

