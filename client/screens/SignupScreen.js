import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!mail.trim()) e.mail = 'Email is required';
    else if (!emailRx.test(mail)) e.mail = 'Email is invalid';
    if (!pass) e.pass = 'Password is required';
    else if (pass.length < 6) e.pass = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

 const handleSignup = async () => {
  // Validate inputs before proceeding
  if (!validate()) {
    Alert.alert('Fix the errors before submitting');
    return;
  }

  try {
    setLoading(true);

    // 1️⃣ Create auth user in Firebase Authentication
    const cred = await createUserWithEmailAndPassword(auth, mail.trim(), pass);
    const uid = cred.user.uid;

    // 2️⃣ Save extra profile data in Firestore database under 'users' collection
    await setDoc(doc(db, 'users', uid), {
      name: name.trim(),
      email: mail.trim(),
      createdAt: new Date(),
    });

    // 3️⃣ Navigate to home screen and reset navigation stack so user can't go back to signup/login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (err) {
    Alert.alert('Signup failed', err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* banner */}
        <View style={styles.headerbar}>
          <Image
            source={require('../assets/images/head.png')}      /* adjust if needed */
            style={styles.headerimg}
          />
        </View>

        {/* form card */}
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            style={[styles.input, errors.name && styles.inputErr]}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
          {errors.name && <Text style={styles.err}>{errors.name}</Text>}

          <TextInput
            style={[styles.input, errors.mail && styles.inputErr]}
            value={mail}
            onChangeText={setMail}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.mail && <Text style={styles.err}>{errors.mail}</Text>}

          <TextInput
            style={[styles.input, errors.pass && styles.inputErr]}
            value={pass}
            onChangeText={setPass}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.pass && <Text style={styles.err}>{errors.pass}</Text>}

          <TouchableOpacity
            style={[styles.btn, loading && styles.disabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.btnTxt}>{loading ? 'Creating…' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.small}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}> Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─────────── styles ─────────── */
const styles = StyleSheet.create({
  flex:    { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, alignItems: 'center', paddingVertical: 40 },
  headerbar: { backgroundColor: '#000B12', width: '100%', alignItems: 'center', paddingVertical: 10 },
  headerimg: { width: 300, height: 75, resizeMode: 'contain' },

  card:   { width: '90%', alignItems: 'center', marginTop: 40 },
  title:  { fontSize: 32, fontWeight: 'bold', color: '#000b12', marginBottom: 30 },

  input:  { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
            paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, marginBottom: 8, color: '#000' },
  inputErr:{ borderColor: 'red' },
  err:    { alignSelf: 'flex-start', color: 'red', marginBottom: 8, fontSize: 14 },

  btn:    { backgroundColor: '#000b12', width: '100%', height: 50, borderRadius: 8,
            justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  disabled:{ opacity: 0.6 },
  btnTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  row:    { flexDirection: 'row', marginTop: 15 },
  small:  { fontSize: 16, color: '#000' },
  link:   { fontSize: 16, color: 'dodgerblue', fontWeight: 'bold' },
});
