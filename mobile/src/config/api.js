// Настройки API
// Адрес вашего сервера
export const API_BASE_URL = 'http://91.236.198.205:3000'; // Ваш сервер

// Для локальной разработки (если backend на вашем ПК):
// export const API_BASE_URL = 'http://10.0.2.2:3000'; // Для эмулятора Android
// export const API_BASE_URL = 'http://localhost:3000'; // Для iOS

export const API_ENDPOINTS = {
  searchUsers: (username) => `${API_BASE_URL}/api/search-users/${username}`,
  getUser: (steamId) => `${API_BASE_URL}/api/user/${steamId}`,
  getUserGames: (steamId) => `${API_BASE_URL}/api/user-games/${steamId}`,
  getInventory: (steamId, appId, contextId = '2') => 
    `${API_BASE_URL}/api/inventory/${steamId}/${appId}?contextId=${contextId}`,
  getItemPrice: (appId, marketHashName) => 
    `${API_BASE_URL}/api/item-price/${appId}/${encodeURIComponent(marketHashName)}`,
};

