import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!username.trim()) {
      Alert.alert('Ошибка', 'Введите имя пользователя');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.searchUsers(username));
      
      if (response.data.success && response.data.users.length > 0) {
        setUsers(response.data.users);
      } else {
        Alert.alert('Не найдено', 'Пользователь с таким ником не найден');
        setUsers([]);
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
      Alert.alert('Ошибка', 'Не удалось найти пользователя. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const selectUser = async (user) => {
    setLoading(true);
    try {
      // Получаем список игр пользователя
      const gamesResponse = await axios.get(API_ENDPOINTS.getUserGames(user.steamid));
      
      if (gamesResponse.data.success && gamesResponse.data.games.length > 0) {
        navigation.navigate('UserInventory', {
          user: user,
          games: gamesResponse.data.games
        });
      } else {
        Alert.alert(
          'Инвентарь недоступен',
          'У пользователя нет игр с инвентарем или профиль приватный'
        );
      }
    } catch (error) {
      console.error('Ошибка получения игр:', error);
      Alert.alert('Ошибка', 'Не удалось получить информацию об играх пользователя');
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => selectUser(item)}>
      <Image
        source={{ uri: item.avatarmedium }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.personaname}</Text>
        <Text style={styles.userStatus}>
          {item.personastate === 1 ? 'В сети' : 'Не в сети'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введите ник пользователя Steam"
          placeholderTextColor="#8b8b8b"
          value={username}
          onChangeText={setUsername}
          onSubmitEditing={searchUsers}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchUsers}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Найти</Text>
          )}
        </TouchableOpacity>
      </View>

      {users.length > 0 && (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.steamid}
          style={styles.userList}
        />
      )}

      {!loading && users.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Введите ник пользователя Steam для поиска
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
  searchContainer: {
    padding: 15,
    backgroundColor: '#171a21',
  },
  input: {
    backgroundColor: '#2a475e',
    color: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#5c7e10',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#2a475e',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userStatus: {
    color: '#8b8b8b',
    fontSize: 14,
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

export default HomeScreen;

