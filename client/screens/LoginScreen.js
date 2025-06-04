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
  View
} from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // your firebase config file

export default function Username({ navigation }) {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false); // password visibility
  const [errors, setErr] = useState({});

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const e = {};

    if (!mail.trim()) e.mail = 'Email is required';
    else if (!emailRx.test(mail)) e.mail = 'Email is invalid';

    if (!pass) e.pass = 'Password is required';
    else if (pass.length < 6) e.pass = 'Min 6 characters';

    setErr(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
  if (validate()) {
    try {
      await signInWithEmailAndPassword(auth, mail, pass);
      // On successful login, navigate to Home
      navigation.navigate('Home');
    } catch (error) {
      // Show firebase auth error messages
      Alert.alert('Login Failed', error.message);
    }
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
        {/* Top banner */}
        <View style={styles.headerbar}>
          <Image source={require('../assets/images/head.png')} style={styles.headerimg} />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Log In</Text>

          <TextInput
            style={[styles.input, errors.name && styles.inputErr]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your Name (optional)"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
          {errors.name && <Text style={styles.errTxt}>{errors.name}</Text>}

          <TextInput
            style={[styles.input, errors.mail && styles.inputErr]}
            value={mail}
            onChangeText={setMail}
            placeholder="Enter your Email-ID"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.mail && <Text style={styles.errTxt}>{errors.mail}</Text>}

          <View style={styles.passRow}>
            <TextInput
              style={[styles.input, styles.passInput, errors.pass && styles.inputErr]}
              value={pass}
              onChangeText={setPass}
              placeholder="Enter your Password"
              placeholderTextColor="#999"
              secureTextEntry={!show}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.showBtn} onPress={() => setShow(!show)}>
              <Text style={styles.showTxt}>{show ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          {errors.pass && <Text style={styles.errTxt}>{errors.pass}</Text>}

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.linkTxt}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              Object.keys(errors).length > 0 || !mail || !pass ? styles.btnDisabled : null,
            ]}
            disabled={Object.keys(errors).length > 0 || !mail || !pass}
            onPress={handleLogin}
          >
            <Text style={styles.btnTxt}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupTxt}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.linkTxt}> Create one</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* Your styles remain the same */

/* ─────────────────────────  STYLES  ───────────────────────── */
const styles = StyleSheet.create({
  flex:          { flex: 1, backgroundColor: '#fff' },

  container:     { flexGrow: 1, alignItems: 'center', paddingVertical: 40 },

  headerbar:     {
    backgroundColor: '#000B12',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerimg:     { width: 300, height: 75, resizeMode: 'contain' },

  card:          { width: '90%', alignItems: 'center', marginTop: 40 },

  title:         { fontSize: 35, fontWeight: 'bold', color: '#000b12', marginBottom: 30 },

  input:         {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  inputErr:      { borderColor: 'red' },

  errTxt:        { alignSelf: 'flex-start', color: 'red', marginBottom: 8, fontSize: 14 },

  passRow:       { width: '100%', flexDirection: 'row', alignItems: 'center' },
  passInput:     { flex: 1, marginBottom: 0 },
  showBtn:       { paddingHorizontal: 10 },
  showTxt:       { color: 'dodgerblue', fontWeight: '600' },

  forgot:        { alignSelf: 'flex-end', marginTop: 8 },
  linkTxt:       { color: 'dodgerblue', fontWeight: 'bold' },

  btn:           {
    backgroundColor: '#000b12',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  btnDisabled:   { backgroundColor: '#999' },
  btnTxt:        { fontSize: 20, color: '#fff', fontWeight: 'bold' },

  signupRow:     { flexDirection: 'row', marginTop: 20 },
  signupTxt:     { fontSize: 18, color: '#000'},
});
