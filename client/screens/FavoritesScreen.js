import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../firebase/firebaseConfig'; // Adjust path to your firebase config

const FavoritesScreen = () => {
  const navigation = useNavigation();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        // Adjust collection path if favorites are user-specific:
        // e.g. collection(db, 'users', userId, 'favorites')
        const q = query(collection(db, 'favorites'), orderBy('date', 'asc'));
        const snapshot = await getDocs(q);

        const favs = snapshot.docs.map(doc => {
          const data = doc.data();

          // Safely convert Firestore Timestamp to JS Date
          let dateObj = null;
          if (data.date) {
            if (typeof data.date.toDate === 'function') {
              dateObj = data.date.toDate();
            } else if (data.date instanceof Date) {
              dateObj = data.date;
            } else {
              dateObj = new Date(data.date);
              if (isNaN(dateObj.getTime())) dateObj = null;
            }
          }

          return {
            id: doc.id,
            ...data,
            date: dateObj,
          };
        });

        setFavorites(favs);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const renderFavorite = ({ item }) => {
    const dateString = item.date
      ? item.date.toLocaleDateString(undefined, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'No Date';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{item.title || 'No Title'}</Text>
        <Text style={styles.date}>{dateString}</Text>
        <Text style={styles.location}>{item.location || 'No Location'}</Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {item.description || 'No Description'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No favorites added yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={item => item.id}
      renderItem={renderFavorite}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#007AFF',
  },
  date: {
    color: '#555',
    marginTop: 4,
  },
  location: {
    color: '#777',
    marginTop: 2,
  },
  description: {
    marginTop: 6,
    color: '#444',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
