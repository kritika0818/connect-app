// screens/HomeScreen.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

/* ─── your feature screens ─── */
import EventTypesScreen from './EventTypesScreen';
import FavoritesScreen from './FavoritesScreen';
import HomeTabScreen from './HomeTabScreen';
import ProfileScreen from './ProfileScreen';
import ScheduledEventsScreen from './ScheduledEventsScreen';

/* ─── firebase ─── */
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, 'users', user.uid));
        setUserProfile(snap.exists() ? snap.data() : null);
      } catch (err) {
        Alert.alert('Error fetching profile', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#000b12" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* professional header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Connect</Text>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      {/* bottom tab navigator */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#90cdf4',
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        >
          {() => <HomeTabScreen userProfile={userProfile} />}
        </Tab.Screen>

        <Tab.Screen
          name="EventTypes"
          component={EventTypesScreen}
          options={{
            title: 'Events',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Scheduled"
          component={ScheduledEventsScreen}
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" color={color} size={size} />
            ),
          }}
        >
          {() => <FavoritesScreen userProfile={userProfile} />}
        </Tab.Screen>

        <Tab.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          }}
        >
          {() => <ProfileScreen userProfile={userProfile} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

/* ─────────────── Styles ─────────────── */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000b12',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logo: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
  tabBar: {
    backgroundColor: '#000b12',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    height: 64,
    paddingBottom: 10,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 10,
  },
});
