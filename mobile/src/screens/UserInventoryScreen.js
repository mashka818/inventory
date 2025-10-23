import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const UserInventoryScreen = ({ route, navigation }) => {
  const { user, games } = route.params;
  const [selectedGame, setSelectedGame] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (games && games.length > 0) {
      // Автоматически выбираем первую игру
      loadInventory(games[0]);
    }
  }, []);

  const loadInventory = async (game) => {
    setSelectedGame(game);
    setLoading(true);
    setInventory([]);

    try {
      const response = await axios.get(
        API_ENDPOINTS.getInventory(user.steamid, game.appid)
      );

      if (response.data.success && response.data.items.length > 0) {
        setInventory(response.data.items);
      } else {
        Alert.alert(
          'Инвентарь пуст',
          'У пользователя нет предметов в этой игре или инвентарь приватный'
        );
      }
    } catch (error) {
      console.error('Ошибка загрузки инвентаря:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить инвентарь');
    } finally {
      setLoading(false);
    }
  };

  const renderGame = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.gameItem,
        selectedGame?.appid === item.appid && styles.selectedGameItem,
      ]}
      onPress={() => loadInventory(item)}>
      <Image
        source={{
          uri: `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appid}/header.jpg`,
        }}
        style={styles.gameIcon}
      />
      <Text style={styles.gameName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderInventoryItem = ({ item }) => {
    const iconUrl = item.icon_url
      ? `https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}`
      : null;

    return (
      <TouchableOpacity
        style={styles.inventoryItem}
        onPress={() =>
          navigation.navigate('ItemDetail', {
            item: item,
            appId: selectedGame?.appid,
          })
        }>
        {iconUrl && (
          <Image source={{ uri: iconUrl }} style={styles.itemIcon} />
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name || item.market_name || 'Без названия'}
          </Text>
          {item.type && (
            <Text style={styles.itemType} numberOfLines={1}>
              {item.type}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Профиль пользователя */}
      <View style={styles.userHeader}>
        <Image source={{ uri: user.avatarmedium }} style={styles.userAvatar} />
        <Text style={styles.userName}>{user.personaname}</Text>
      </View>

      {/* Список игр */}
      <View style={styles.gamesSection}>
        <Text style={styles.sectionTitle}>Выберите игру:</Text>
        <FlatList
          horizontal
          data={games}
          renderItem={renderGame}
          keyExtractor={(item) => item.appid.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Инвентарь */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5c7e10" />
          <Text style={styles.loadingText}>Загрузка инвентаря...</Text>
        </View>
      ) : inventory.length > 0 ? (
        <View style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>
            Предметов: {inventory.length}
          </Text>
          <FlatList
            data={inventory}
            renderItem={renderInventoryItem}
            keyExtractor={(item, index) =>
              `${item.assetid || item.id || index}`
            }
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedGame
              ? 'Выберите игру для просмотра инвентаря'
              : 'Нет доступных предметов'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#171a21',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gamesSection: {
    backgroundColor: '#2a475e',
    padding: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gameItem: {
    marginRight: 10,
    alignItems: 'center',
    width: 120,
    padding: 8,
    backgroundColor: '#1b2838',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGameItem: {
    borderColor: '#5c7e10',
  },
  gameIcon: {
    width: 100,
    height: 50,
    borderRadius: 5,
    marginBottom: 5,
  },
  gameName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  inventorySection: {
    flex: 1,
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  inventoryItem: {
    flex: 1,
    backgroundColor: '#2a475e',
    margin: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  itemIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  itemInfo: {
    width: '100%',
  },
  itemName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  itemType: {
    color: '#8b8b8b',
    fontSize: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8b8b8b',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#8b8b8b',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserInventoryScreen;

