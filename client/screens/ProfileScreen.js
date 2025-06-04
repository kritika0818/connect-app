import { useNavigation } from '@react-navigation/native'; // ✅ Import this
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';

const ProfileScreen = () => {
  const navigation = useNavigation(); // ✅ Use hook here

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
console.log('Current user ID:', userId);
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.createdAt?.toDate) {
            data.createdAt = data.createdAt.toDate();
          }

          setProfile({ ...data, id: userId });
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleEditProfile = () => {
  if (!profile) return;

  const serializableProfile = {
    ...profile,
    createdAt:
      profile.createdAt instanceof Date
        ? profile.createdAt.toISOString()
        : profile.createdAt || null,
  };

  navigation.navigate('EditProfile', { profile: serializableProfile }); // ✅ Direct navigation
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

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profile.avatarUrl ? (
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarPlaceholderText}>
            {profile.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
      )}

      <Text style={styles.name}>{profile.name || 'No Name'}</Text>
      <Text style={styles.email}>{profile.email || 'No Email'}</Text>
      {profile.phone && <Text style={styles.phone}>📞 {profile.phone}</Text>}
      {profile.createdAt && (
        <Text style={styles.joined}>
          Joined on {new Date(profile.createdAt).toLocaleDateString()}
        </Text>
      )}

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    backgroundColor: '#ccc',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  avatarPlaceholderText: {
    fontSize: 64,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  joined: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ProfileScreen;
