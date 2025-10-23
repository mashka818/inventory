# 📁 Структура проекта Inventory Checker

## Общая структура

```
InventoryChecker/
├── backend/                    # Backend сервер (Node.js + Express)
│   ├── node_modules/          # Зависимости (создается при npm install)
│   ├── .env                   # Переменные окружения (создайте из .env.example)
│   ├── .env.example           # Пример конфигурации
│   ├── .gitignore            # Исключения для Git
│   ├── package.json          # Зависимости и скрипты
│   ├── server.js             # Главный файл сервера
│   └── README.md             # Документация backend
│
├── mobile/                    # React Native приложение
│   ├── android/              # Android специфичные файлы
│   │   ├── app/
│   │   │   ├── src/main/
│   │   │   │   ├── java/com/inventorychecker/
│   │   │   │   │   ├── MainActivity.java        # Главная активность
│   │   │   │   │   └── MainApplication.java     # Приложение Android
│   │   │   │   ├── res/                         # Ресурсы Android
│   │   │   │   │   ├── drawable/
│   │   │   │   │   ├── values/
│   │   │   │   │   │   ├── colors.xml
│   │   │   │   │   │   ├── strings.xml
│   │   │   │   │   │   └── styles.xml
│   │   │   │   │   └── mipmap/                  # Иконки приложения
│   │   │   │   └── AndroidManifest.xml          # Манифест приложения
│   │   │   ├── build.gradle                     # Конфигурация сборки app
│   │   │   └── proguard-rules.pro               # Правила ProGuard
│   │   ├── gradle/wrapper/                      # Gradle wrapper
│   │   ├── build.gradle                         # Главный build.gradle
│   │   ├── settings.gradle                      # Настройки Gradle
│   │   ├── gradle.properties                    # Свойства Gradle
│   │   └── gradlew.bat                          # Gradle wrapper для Windows
│   │
│   ├── src/                   # Исходный код React Native
│   │   ├── screens/          # Экраны приложения
│   │   │   ├── HomeScreen.js              # Главный экран (поиск)
│   │   │   ├── UserInventoryScreen.js     # Экран инвентаря
│   │   │   └── ItemDetailScreen.js        # Детали предмета
│   │   └── config/           # Конфигурация
│   │       └── api.js                     # Настройки API
│   │
│   ├── node_modules/         # Зависимости (создается при npm install)
│   ├── .buckconfig          # Конфигурация Buck
│   ├── .env.example         # Пример переменных окружения
│   ├── .gitignore           # Исключения для Git
│   ├── .watchmanconfig      # Конфигурация Watchman
│   ├── App.js               # Главный компонент приложения
│   ├── app.json             # Метаданные приложения
│   ├── babel.config.js      # Конфигурация Babel
│   ├── index.js             # Точка входа
│   ├── metro.config.js      # Конфигурация Metro bundler
│   ├── package.json         # Зависимости и скрипты
│   └── README.md            # Документация mobile
│
├── .gitignore               # Главный .gitignore
├── README.md                # Главная документация
├── QUICK_START.md          # Быстрый старт
├── PUBLISH_GUIDE.md        # Руководство по публикации
├── TROUBLESHOOTING.md      # Решение проблем
├── PROJECT_STRUCTURE.md    # Этот файл
└── start-dev.bat           # Скрипт для запуска (Windows)
```

---

## 🔧 Backend структура

### `/backend/server.js`

Главный файл сервера с API endpoints:

- **GET** `/api/search-users/:username` - Поиск пользователей
- **GET** `/api/user/:steamId` - Информация о пользователе
- **GET** `/api/user-games/:steamId` - Список игр пользователя
- **GET** `/api/inventory/:steamId/:appId` - Инвентарь игры
- **GET** `/api/item-price/:appId/:marketHashName` - Цена предмета

### Зависимости (package.json):

```json
{
  "express": "^4.18.2",      // Web-фреймворк
  "cors": "^2.8.5",          // CORS middleware
  "axios": "^1.6.0",         // HTTP клиент
  "dotenv": "^16.3.1"        // Переменные окружения
}
```

---

## 📱 Mobile структура

### Экраны (`/mobile/src/screens/`)

#### 1. HomeScreen.js
- Поиск пользователей Steam
- Отображение результатов поиска
- Переход к инвентарю

**Основные компоненты:**
- TextInput для ввода ника
- FlatList для списка пользователей
- TouchableOpacity для выбора

#### 2. UserInventoryScreen.js
- Отображение профиля пользователя
- Горизонтальный список игр
- Сетка предметов инвентаря

**Основные компоненты:**
- Профиль (Avatar + Name)
- FlatList (horizontal) для игр
- FlatList (numColumns=2) для инвентаря

#### 3. ItemDetailScreen.js
- Изображение предмета
- Название и описание
- Цены с торговой площадки
- Теги и характеристики
- Ссылка на Steam Market

**Основные компоненты:**
- ScrollView для прокрутки
- Image для иконки предмета
- TouchableOpacity для кнопок

### Конфигурация (`/mobile/src/config/`)

#### api.js
Централизованная конфигурация API endpoints:

```javascript
export const API_BASE_URL = 'http://10.0.2.2:3000';
export const API_ENDPOINTS = {
  searchUsers: (username) => `${API_BASE_URL}/api/search-users/${username}`,
  // ... другие endpoints
};
```

### Навигация (`/mobile/App.js`)

Использует React Navigation v6:
```
Stack Navigator
├── Home (HomeScreen)
├── UserInventory (UserInventoryScreen)
└── ItemDetail (ItemDetailScreen)
```

---

## 🎨 Стилизация

### Цветовая схема (Steam-inspired):

```javascript
{
  background: '#1b2838',      // Основной фон
  surface: '#2a475e',         // Карточки
  dark: '#171a21',            // Хедер
  accent: '#5c7e10',          // Кнопки
  text: '#ffffff',            // Основной текст
  textSecondary: '#8b8b8b',   // Вторичный текст
  textLight: '#c7d5e0'        // Светлый текст
}
```

---

## 📦 Зависимости

### Backend

| Пакет | Версия | Назначение |
|-------|--------|-----------|
| express | ^4.18.2 | Web-сервер |
| cors | ^2.8.5 | CORS поддержка |
| axios | ^1.6.0 | HTTP запросы |
| dotenv | ^16.3.1 | Environment variables |
| nodemon | ^3.0.1 | Dev auto-reload |

### Mobile

| Пакет | Версия | Назначение |
|-------|--------|-----------|
| react | 18.2.0 | UI библиотека |
| react-native | 0.73.0 | Мобильный фреймворк |
| @react-navigation/native | ^6.1.9 | Навигация |
| @react-navigation/native-stack | ^6.9.17 | Stack навигатор |
| axios | ^1.6.0 | HTTP клиент |
| react-native-safe-area-context | ^4.8.0 | Safe area |
| react-native-screens | ^3.27.0 | Native screens |
| react-native-vector-icons | ^10.0.2 | Иконки |

---

## 🔄 Поток данных

```
User Input → HomeScreen → API Request → Backend Server
                                              ↓
                                        Steam Web API
                                              ↓
                                        Response Data
                                              ↓
Frontend (React Native) ← JSON Response ← Backend
```

### Пример потока:

1. **Поиск пользователя:**
   ```
   User types "username"
   → HomeScreen calls API.searchUsers("username")
   → Backend: GET /api/search-users/username
   → Steam API: ResolveVanityURL + GetPlayerSummaries
   → Backend returns user data
   → HomeScreen displays results
   ```

2. **Просмотр инвентаря:**
   ```
   User selects player
   → Navigate to UserInventoryScreen
   → API.getUserGames(steamId)
   → User selects game
   → API.getInventory(steamId, appId)
   → Display inventory items
   ```

3. **Просмотр предмета:**
   ```
   User taps item
   → Navigate to ItemDetailScreen
   → API.getItemPrice(appId, marketHashName)
   → Display item details and price
   ```

---

## 🚀 Сборка и развертывание

### Development режим:

```
start-dev.bat
  ├── cd backend → npm install → npm run dev
  ├── cd mobile → npm install → npm start
  └── cd mobile → npm run android
```

### Production сборка:

```
Backend:
npm start (на сервере с PM2)

Mobile:
cd mobile/android
./gradlew assembleRelease
→ app-release.apk в build/outputs/apk/release/
```

---

## 📝 Файлы конфигурации

### Backend

- **`.env`** - Переменные окружения (API ключи)
- **`package.json`** - Зависимости и скрипты

### Mobile

- **`package.json`** - Зависимости React Native
- **`babel.config.js`** - Транспиляция JavaScript
- **`metro.config.js`** - Bundler конфигурация
- **`android/app/build.gradle`** - Конфигурация Android build
- **`android/gradle.properties`** - Свойства Gradle
- **`android/app/src/main/AndroidManifest.xml`** - Android манифест

---

## 🔐 Безопасность

### Что НЕ коммитить в Git:

```
backend/.env                    # API ключи
backend/node_modules/          # Зависимости
mobile/node_modules/           # Зависимости
mobile/android/app/build/      # Build артефакты
*.keystore                     # Ключи подписи
android/local.properties       # Локальные настройки
```

### Что коммитить:

```
backend/.env.example           # Пример конфигурации
mobile/.env.example           # Пример конфигурации
Все исходные файлы (.js, .json)
Конфигурационные файлы
Документация
```

---

## 🧪 Тестирование

### Запуск на эмуляторе:
```bash
# Запустите AVD в Android Studio
# Затем:
cd mobile
npm run android
```

### Запуск на устройстве:
```bash
# Подключите устройство через USB
adb devices  # Проверьте подключение
cd mobile
npm run android
```

### Отладка:
```bash
# React Native DevTools
# Shake device или Ctrl+M → "Debug"

# Android logs
adb logcat | grep InventoryChecker
```

---

## 📚 Дополнительная документация

- **README.md** - Общая информация и быстрый старт
- **QUICK_START.md** - Пошаговое руководство для начинающих
- **PUBLISH_GUIDE.md** - Публикация в RuStore и Google Play
- **TROUBLESHOOTING.md** - Решение распространенных проблем
- **PROJECT_STRUCTURE.md** - Структура проекта (этот файл)

---

## 🎯 Следующие шаги

### Для разработчика:

1. ✅ Изучите структуру проекта
2. ✅ Настройте окружение разработки
3. ✅ Получите Steam API ключ
4. ✅ Запустите backend и mobile
5. ✅ Протестируйте все функции
6. 🔄 Добавьте новые возможности
7. 🔄 Оптимизируйте производительность
8. 🔄 Подготовьте к публикации

### Возможные улучшения:

- 🔜 Кеширование данных
- 🔜 Офлайн режим
- 🔜 Push уведомления
- 🔜 Избранные пользователи
- 🔜 История поисков
- 🔜 Темная/светлая тема
- 🔜 Мультиязычность
- 🔜 Статистика инвентаря

---

Счастливого кодирования! 💻🚀

