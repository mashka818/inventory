# Inventory Checker Mobile App

React Native приложение для Android для просмотра инвентаря Steam.

## Установка

```bash
npm install
```

## Настройка

Откройте `src/config/api.js` и настройте адрес вашего backend сервера:

```javascript
// Для эмулятора Android
export const API_BASE_URL = 'http://10.0.2.2:3000';

// Для реального устройства
// export const API_BASE_URL = 'http://IP_ВАШЕГО_КОМПЬЮТЕРА:3000';
```

## Запуск

### Запуск Metro Bundler
```bash
npm start
```

### Запуск на Android
```bash
npm run android
```

## Сборка APK

### Debug версия
```bash
cd android
./gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release версия

1. Создайте keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Измените `android/app/build.gradle`, добавив конфигурацию подписи.

3. Соберите:
```bash
cd android
./gradlew assembleRelease
```

APK: `android/app/build/outputs/apk/release/app-release.apk`

## Структура проекта

```
mobile/
├── src/
│   ├── screens/           # Экраны приложения
│   │   ├── HomeScreen.js          # Главный экран (поиск)
│   │   ├── UserInventoryScreen.js # Экран инвентаря
│   │   └── ItemDetailScreen.js    # Детали предмета
│   └── config/
│       └── api.js                 # Конфигурация API
├── android/               # Android специфичные файлы
├── App.js                # Главный компонент
└── package.json
```

## Отладка

### Просмотр логов
```bash
npm run android -- --verbose
```

### React Native Debugger
1. Включите Developer Menu (shake device или Ctrl+M)
2. Выберите "Debug"

### Очистка кэша
```bash
npm start -- --reset-cache
```

## Устранение проблем

### Ошибка "Unable to load script"
```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
npm run android
```

### Ошибки сборки Gradle
```bash
cd android
./gradlew clean build --stacktrace
```

### Проблемы с Metro Bundler
```bash
npx react-native start --reset-cache
```

