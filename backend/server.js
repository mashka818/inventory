const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Steam API Key
const STEAM_API_KEY = process.env.STEAM_API_KEY;

// Поиск пользователей Steam по нику
app.get('/api/search-users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log('🔍 Поиск пользователя:', username);
    console.log('🔑 STEAM_API_KEY установлен:', STEAM_API_KEY ? 'ДА' : 'НЕТ');
    
    const allUsers = [];
    
    // 1. Если введен Steam ID (только цифры), получаем напрямую
    if (/^\d+$/.test(username)) {
      console.log('📌 Поиск по Steam ID64');
      try {
        const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${username}`;
        console.log('🌐 Запрос:', url.replace(STEAM_API_KEY, 'KEY'));
        
        const userInfo = await axios.get(url);
        console.log('✅ Ответ GetPlayerSummaries:', JSON.stringify(userInfo.data));
        
        if (userInfo.data.response.players.length > 0) {
          console.log('✅ Найден пользователь по Steam ID');
          return res.json({
            success: true,
            users: userInfo.data.response.players
          });
        }
      } catch (error) {
        console.error('❌ Поиск по Steam ID не удался:', error.message);
        console.error('Детали:', error.response?.data);
      }
    }
    
    // 2. Ищем по vanity URL (никнейм)
    console.log('📌 Поиск по Vanity URL');
    try {
      const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${username}`;
      console.log('🌐 Запрос:', url.replace(STEAM_API_KEY, 'KEY'));
      
      const response = await axios.get(url);
      console.log('📥 Ответ ResolveVanityURL:', JSON.stringify(response.data));

      if (response.data.response.success === 1) {
        const steamId = response.data.response.steamid;
        console.log('✅ Найден Steam ID:', steamId);
        
        const userInfo = await axios.get(
          `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
        );
        console.log('📥 Ответ GetPlayerSummaries:', JSON.stringify(userInfo.data));

        if (userInfo.data.response.players.length > 0) {
          allUsers.push(...userInfo.data.response.players);
        }
      } else {
        console.log('⚠️ ResolveVanityURL вернул success !== 1');
      }
    } catch (vanityError) {
      console.error('❌ ResolveVanityURL не удался:', vanityError.message);
      console.error('Детали:', vanityError.response?.data);
    }

    if (allUsers.length > 0) {
      console.log('✅ Отправляем', allUsers.length, 'пользователей');
      res.json({
        success: true,
        users: allUsers
      });
    } else {
      console.log('❌ Пользователи не найдены');
      res.json({
        success: false,
        message: 'Пользователь не найден. Попробуйте точный никнейм или Steam ID.',
        users: []
      });
    }
  } catch (error) {
    console.error('❌ Критическая ошибка поиска:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера',
      users: []
    });
  }
});

// Получение инвентаря пользователя
app.get('/api/inventory/:steamId/:appId', async (req, res) => {
  try {
    const { steamId, appId } = req.params;
    const contextId = req.query.contextId || '2';

    // Правильный URL без лишних параметров (как curl)
    const url = `https://steamcommunity.com/inventory/${steamId}/${appId}/${contextId}`;
    
    console.log('🎒 Запрос инвентаря:', { steamId, appId, contextId });
    console.log('🌐 URL:', url);

    // Получаем инвентарь через Steam Community API (минимум заголовков, как curl)
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'curl/8.5.0',
        'Accept': '*/*'
      },
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500; // Не выбрасываем ошибку для статусов < 500
      }
    });

    console.log('📦 Ответ получен, статус:', response.status);

    if (response.status === 200 && response.data) {
      console.log('📦 Данные получены');
      
      // Проверяем структуру ответа
      if (response.data.assets && response.data.assets.length > 0) {
        console.log('✅ Найдено предметов:', response.data.assets.length);
        
        // Объединяем информацию о предметах с их описаниями
        const items = response.data.assets.map(asset => {
          const description = response.data.descriptions.find(
            desc => desc.classid === asset.classid && desc.instanceid === asset.instanceid
          );
          return {
            ...asset,
            ...description
          };
        });

        return res.json({
          success: true,
          items: items,
          total: items.length
        });
      } else if (response.data.total === 0) {
        console.log('⚠️ Инвентарь пуст (total = 0)');
        return res.json({
          success: false,
          message: 'У пользователя нет предметов в этой игре'
        });
      } else {
        console.log('⚠️ Неожиданная структура данных:', JSON.stringify(response.data).substring(0, 200));
      }
    } else if (response.status === 403) {
      console.log('❌ 403: Инвентарь приватный');
      return res.json({
        success: false,
        message: 'Инвентарь приватный. Откройте настройки приватности инвентаря в Steam.'
      });
    } else if (response.status === 400) {
      console.log('❌ 400: Неверный запрос или инвентарь приватный');
      console.log('❌ Тело ответа 400:', JSON.stringify(response.data));
      return res.json({
        success: false,
        message: 'Инвентарь недоступен. Возможно: 1) У пользователя нет предметов в этой игре, 2) Инвентарь приватный для этой игры.'
      });
    }
    
    // Если дошли сюда - что-то пошло не так
    console.log('⚠️ Непредвиденный ответ, статус:', response.status);
    res.json({
      success: false,
      message: 'Инвентарь пуст или недоступен'
    });
    
  } catch (error) {
    console.error('❌ Критическая ошибка получения инвентаря:', error.message);
    console.error('❌ Статус:', error.response?.status);
    console.error('❌ Данные:', error.response?.data);
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении инвентаря'
    });
  }
});

// Получение цены предмета с различных торговых площадок
app.get('/api/item-price/:appId/:marketHashName', async (req, res) => {
  try {
    const { appId, marketHashName } = req.params;

    // Получаем цену с Steam Community Market
    const response = await axios.get(
      `https://steamcommunity.com/market/priceoverview/?appid=${appId}&currency=1&market_hash_name=${encodeURIComponent(marketHashName)}`
    );

    if (response.data.success) {
      res.json({
        success: true,
        price: response.data
      });
    } else {
      res.json({
        success: false,
        message: 'Цена не найдена'
      });
    }
  } catch (error) {
    console.error('Ошибка получения цены:', error.message);
    res.status(500).json({
      success: false,
      message: 'Не удалось получить цену предмета'
    });
  }
});

// Получение информации о пользователе по Steam ID
app.get('/api/user/:steamId', async (req, res) => {
  try {
    const { steamId } = req.params;

    const response = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
    );

    if (response.data.response.players.length > 0) {
      res.json({
        success: true,
        user: response.data.response.players[0]
      });
    } else {
      res.json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
  } catch (error) {
    console.error('Ошибка получения информации о пользователе:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Получение списка игр пользователя
app.get('/api/user-games/:steamId', async (req, res) => {
  try {
    const { steamId } = req.params;
    
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;
    console.log('🎮 Запрос игр для Steam ID:', steamId);
    console.log('🌐 URL:', url.replace(STEAM_API_KEY, 'KEY'));

    const response = await axios.get(url);
    
    console.log('📥 Ответ получен');
    console.log('📥 Структура:', response.data.response ? 'OK' : 'ERROR');

    if (response.data.response && response.data.response.games) {
      const totalGames = response.data.response.games.length;
      console.log('🎮 Всего игр:', totalGames);
      
      // Фильтруем игры с инвентарем (CS:GO/CS2, Dota 2, TF2, и т.д.)
      const inventoryGames = [730, 570, 440, 578080, 252490]; // CS2, Dota 2, TF2, PUBG, Rust
      const gamesWithInventory = response.data.response.games.filter(game => 
        inventoryGames.includes(game.appid)
      );
      
      console.log('🎒 Игр с инвентарем:', gamesWithInventory.length);
      console.log('🎒 Найденные игры:', gamesWithInventory.map(g => `${g.name} (${g.appid})`).join(', '));

      const resultGames = gamesWithInventory.length > 0 ? gamesWithInventory : response.data.response.games.slice(0, 10);
      console.log('✅ Отправляем игр:', resultGames.length);

      res.json({
        success: true,
        games: resultGames
      });
    } else {
      console.log('⚠️ Нет данных об играх в ответе');
      res.json({
        success: false,
        message: 'Не удалось получить список игр'
      });
    }
  } catch (error) {
    console.error('❌ Ошибка получения списка игр:', error.message);
    console.error('❌ Статус:', error.response?.status);
    console.error('❌ Данные:', error.response?.data);
    
    res.status(500).json({
      success: false,
      message: 'Не удалось получить список игр. Возможно, профиль приватный.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступен по адресу: http://localhost:${PORT}`);
});

