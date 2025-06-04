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
import { db } from '../firebase/firebaseConfig'; // adjust path if needed

export default function ScheduledEventsScreen() {
  const navigation = useNavigation();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScheduledEvents = async () => {
      try {
        setLoading(true);
        setError('');

        const q = query(collection(db, 'scheduledEvents'), orderBy('date', 'asc'));
        const snapshot = await getDocs(q);

        const eventsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventsList);
      } catch (err) {
        console.error('Error fetching scheduled events:', err);
        setError('Failed to load scheduled events.');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledEvents();
  }, []);

  const renderItem = ({ item }) => {
    // Safely parse Firestore Timestamp to JS Date
    let eventDate = null;
    if (item.date) {
      if (typeof item.date.toDate === 'function') {
        eventDate = item.date.toDate();
      } else if (item.date instanceof Date) {
        eventDate = item.date;
      } else {
        // fallback attempt if date stored as string or timestamp number
        eventDate = new Date(item.date);
        if (isNaN(eventDate.getTime())) eventDate = null;
      }
    }

    const dateString = eventDate
      ? eventDate.toLocaleDateString(undefined, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'No Date';

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        activeOpacity={0.8}
      >
        <Text style={styles.title}>{item.title ?? 'Untitled Event'}</Text>
        <Text style={styles.date}>{dateString}</Text>
        {item.location ? <Text style={styles.location}>{item.location}</Text> : null}
        {item.description ? (
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000b12" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No scheduled events available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },

  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000b12',
  },

  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },

  location: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
  },

  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
});
