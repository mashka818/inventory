import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const ItemDetailScreen = ({ route }) => {
  const { item, appId } = route.params;
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrice();
  }, []);

  const loadPrice = async () => {
    if (!item.market_hash_name) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        API_ENDPOINTS.getItemPrice(appId, item.market_hash_name)
      );

      if (response.data.success) {
        setPrice(response.data.price);
      }
    } catch (error) {
      console.error('Ошибка загрузки цены:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInMarket = () => {
    if (item.market_hash_name) {
      const url = `https://steamcommunity.com/market/listings/${appId}/${encodeURIComponent(
        item.market_hash_name
      )}`;
      Linking.openURL(url);
    }
  };

  const iconUrl = item.icon_url_large || item.icon_url
    ? `https://community.cloudflare.steamstatic.com/economy/image/${
        item.icon_url_large || item.icon_url
      }`
    : null;

  // Определяем цвет рамки по редкости
  const getRarityColor = () => {
    if (!item.tags) return '#2a475e';
    
    const rarityTag = item.tags.find(tag => tag.category === 'Rarity');
    if (!rarityTag) return '#2a475e';

    const colorMap = {
      'Rarity_Common': '#b0c3d9',
      'Rarity_Uncommon': '#5e98d9',
      'Rarity_Rare': '#4b69ff',
      'Rarity_Mythical': '#8847ff',
      'Rarity_Legendary': '#d32ce6',
      'Rarity_Ancient': '#eb4b4b',
      'Rarity_Immortal': '#e4ae39',
    };

    return colorMap[rarityTag.internal_name] || '#2a475e';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Изображение предмета */}
      <View style={[styles.imageContainer, { borderColor: getRarityColor() }]}>
        {iconUrl && (
          <Image source={{ uri: iconUrl }} style={styles.itemImage} />
        )}
      </View>

      {/* Название предмета */}
      <Text style={styles.itemName}>
        {item.name || item.market_name || 'Без названия'}
      </Text>

      {/* Цена */}
      <View style={styles.priceContainer}>
        {loading ? (
          <ActivityIndicator color="#5c7e10" />
        ) : price ? (
          <View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Минимальная цена:</Text>
              <Text style={styles.priceValue}>{price.lowest_price || 'N/A'}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Средняя цена:</Text>
              <Text style={styles.priceValue}>{price.median_price || 'N/A'}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Продано (24ч):</Text>
              <Text style={styles.priceValue}>{price.volume || 'N/A'}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noPriceText}>
            Цена недоступна или предмет не продается
          </Text>
        )}
      </View>

      {/* Тип предмета */}
      {item.type && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Тип:</Text>
          <Text style={styles.infoValue}>{item.type}</Text>
        </View>
      )}

      {/* Описание */}
      {item.descriptions && item.descriptions.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Описание:</Text>
          {item.descriptions.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>
              {desc.value}
            </Text>
          ))}
        </View>
      )}

      {/* Теги */}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Теги:</Text>
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag.localized_tag_name || tag.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Кнопка открыть на торговой площадке */}
      {item.market_hash_name && (
        <TouchableOpacity style={styles.marketButton} onPress={openInMarket}>
          <Text style={styles.marketButtonText}>
            Открыть на торговой площадке Steam
          </Text>
        </TouchableOpacity>
      )}

      {/* Дополнительная информация */}
      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Дополнительно:</Text>
        {item.tradable !== undefined && (
          <Text style={styles.infoValue}>
            Возможность обмена: {item.tradable ? 'Да' : 'Нет'}
          </Text>
        )}
        {item.marketable !== undefined && (
          <Text style={styles.infoValue}>
            Продажа на торговой площадке: {item.marketable ? 'Да' : 'Нет'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2a475e',
    margin: 15,
    borderRadius: 10,
    borderWidth: 3,
  },
  itemImage: {
    width: 200,
    height: 200,
  },
  itemName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  priceContainer: {
    backgroundColor: '#2a475e',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    color: '#8b8b8b',
    fontSize: 16,
  },
  priceValue: {
    color: '#5c7e10',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noPriceText: {
    color: '#8b8b8b',
    textAlign: 'center',
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: '#2a475e',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoValue: {
    color: '#c7d5e0',
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    color: '#c7d5e0',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#1b2838',
    padding: 8,
    borderRadius: 5,
    margin: 4,
  },
  tagText: {
    color: '#8b8b8b',
    fontSize: 12,
  },
  marketButton: {
    backgroundColor: '#5c7e10',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  marketButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ItemDetailScreen;

