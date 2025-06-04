import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login'); // or replace with conditional logic if needed
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/4.png')} style={styles.logo} />

      <View style={styles.info}>
        <Text style={styles.welcome}>Welcome to Connect</Text>
        <Text style={styles.phrase}>
          "Enhance your skills in your chosen field by joining our platform,
          which provides opportunities to participate in events throughout India."
        </Text>
      </View>

      <View style={styles.btnposition}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.btntext}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000b12',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  info: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  welcome: {
    fontSize: 30,
    color: 'lightskyblue',
    fontWeight: 'bold',
    marginTop: 20,
  },
  phrase: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  btnposition: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'lightskyblue',
    borderRadius: 8,
    height: 40,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    fontSize: 20,
    color: '#000b12',
    fontWeight: 'bold',
  },
});
