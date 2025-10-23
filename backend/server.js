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
    
    // Используем ResolveVanityURL для поиска пользователя
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${username}`
    );

    if (response.data.response.success === 1) {
      const steamId = response.data.response.steamid;
      
      // Получаем информацию о пользователе
      const userInfo = await axios.get(
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
      );

      res.json({
        success: true,
        users: userInfo.data.response.players
      });
    } else {
      res.json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
  } catch (error) {
    console.error('Ошибка поиска пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Получение инвентаря пользователя
app.get('/api/inventory/:steamId/:appId', async (req, res) => {
  try {
    const { steamId, appId } = req.params;
    const contextId = req.query.contextId || '2';

    // Получаем инвентарь через Steam Community API
    const response = await axios.get(
      `https://steamcommunity.com/inventory/${steamId}/${appId}/${contextId}?l=english&count=5000`
    );

    if (response.data && response.data.assets) {
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

      res.json({
        success: true,
        items: items,
        total: items.length
      });
    } else {
      res.json({
        success: false,
        message: 'Инвентарь пуст или приватный'
      });
    }
  } catch (error) {
    console.error('Ошибка получения инвентаря:', error.message);
    res.status(500).json({
      success: false,
      message: 'Не удалось получить инвентарь. Возможно, профиль приватный.'
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

    const response = await axios.get(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`
    );

    if (response.data.response && response.data.response.games) {
      // Фильтруем игры с инвентарем (CS:GO, Dota 2, TF2, и т.д.)
      const gamesWithInventory = response.data.response.games.filter(game => {
        const inventoryGames = [730, 570, 440, 578080, 252490]; // CS:GO, Dota 2, TF2, PUBG, Rust
        return inventoryGames.includes(game.appid);
      });

      res.json({
        success: true,
        games: gamesWithInventory.length > 0 ? gamesWithInventory : response.data.response.games.slice(0, 10)
      });
    } else {
      res.json({
        success: false,
        message: 'Не удалось получить список игр'
      });
    }
  } catch (error) {
    console.error('Ошибка получения списка игр:', error.message);
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

