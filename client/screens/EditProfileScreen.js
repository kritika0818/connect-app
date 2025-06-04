import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

const BACKEND_URL = 'http://192.168.1.10:3000'; // 🔁 Replace with your actual backend IP/URL

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const rawProfile = route.params?.profile || {};
  const profile = {
    ...rawProfile,
    createdAt: rawProfile.createdAt ? new Date(rawProfile.createdAt) : null,
  };

  const userId = profile?.id || profile?.uid;
  if (!userId) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.errorText}>Error: User ID not found</Text>
      </ScrollView>
    );
  }

  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [college, setCollege] = useState(profile.college || '');
  const [branch, setBranch] = useState(profile.branch || '');
  const [collegeCity, setCollegeCity] = useState(profile.college_city || '');
  const [collegeState, setCollegeState] = useState(profile.college_state || '');
  const [about, setAbout] = useState(profile.about || '');
  const [location, setLocation] = useState(profile.location || '');

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to pick a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const save = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          avatarUrl,
          college,
          branch,
          college_city: collegeCity,
          college_state: collegeState,
          about,
          location,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Update Failed', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Personal Details</Text>

      <TouchableOpacity style={styles.avatarWrap} onPress={pickPhoto}>
        <Image
          source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickPhoto}>
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.sectionTitle}>College Details</Text>
      <TextInput
        style={styles.input}
        placeholder="College Name"
        value={college}
        onChangeText={setCollege}
      />
      <TextInput
        style={styles.input}
        placeholder="Branch / Department"
        value={branch}
        onChangeText={setBranch}
      />
      <TextInput
        style={styles.input}
        placeholder="College City"
        value={collegeCity}
        onChangeText={setCollegeCity}
      />
      <TextInput
        style={styles.input}
        placeholder="College State"
        value={collegeState}
        onChangeText={setCollegeState}
      />

      <Text style={styles.sectionTitle}>Other Details</Text>
      <TextInput
        style={styles.input}
        placeholder="About"
        value={about}
        onChangeText={setAbout}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity onPress={save} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f4f8',
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 20,
    marginVertical: 20,
    color: '#1c1c1c',
  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 70,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#eee',
  },
  changePhoto: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
