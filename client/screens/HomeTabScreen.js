// screens/Hackathon.jsx  (Top Notch Events)
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { addToWishList } from '../redux/WishlistSlice';

/* firebase */
import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function Hackathon() {
  const [events, setEvents]   = useState([]);
  const [queryTxt, setQuery]  = useState('');
  const [loading, setLoading] = useState(true);

  const dispatch   = useDispatch();
  const navigation = useNavigation();

  /* ─── Fetch top-ranked events ─── */
  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, 'events'),
          orderBy('registrations', 'desc'),
          orderBy('averageRating', 'desc'),
          limit(20)                       // top 20
        );
        const snap = await getDocs(q);
        const arr  = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEvents(arr);
      } catch (err) {
        console.error('fetchEvents', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─── Filter by search term ─── */
  const filtered = useMemo(() => {
    if (!queryTxt.trim()) return events;
    const q = queryTxt.trim().toLowerCase();
    return events.filter(e => e.name.toLowerCase().includes(q));
  }, [queryTxt, events]);

  /* ─── Register user for an event ─── */
  const registerNow = async evtId => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return navigation.navigate('Login');

      // 1. add document in sub-collection
      const regRef = doc(db, 'events', evtId, 'registrations', uid);
      await setDoc(regRef, { createdAt: serverTimestamp() });

      // 2. increment count atomically
      await setDoc(
        doc(db, 'events', evtId),
        { registrations: increment(1) },
        { merge: true }
      );
      alert('Registered!');
    } catch (err) {
      alert(err.message);
    }
  };

  /* ─── Render single card ─── */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* header row */}
      <View style={styles.cardHead}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity onPress={() => dispatch(addToWishList(item))}>
          <Ionicons name="star-outline" size={22} color="#e6b800" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Image source={{ uri: item.bannerUrl }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.txt}>{item.date?.toDate?.().toLocaleDateString() || '--'}</Text>
          <Text style={styles.txt}>{item.location}</Text>
          <Text style={styles.txt}>{item.mode}</Text>
          <Text style={styles.txt}>{item.topic}</Text>
          <Text style={styles.txt}>{item.fee}</Text>

          {/* action buttons */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={() => registerNow(item.id)}>
              <Text style={styles.btnTxt}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#3949ab' }]}
              onPress={() => navigation.navigate('EventDetails', { id: item.id })}
            >
              <Text style={styles.btnTxt}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  /* ─── header (search) ─── */
  const ListHeader = (
    <View style={styles.header}>
      <Text style={styles.heading}>Top-Notch Events</Text>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color="#555" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search events"
          placeholderTextColor="#666"
          value={queryTxt}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000b12" />
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={i => i.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

/* ─── styles ─── */
const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },

  header: { paddingHorizontal:16, paddingBottom:12 },
  heading:{ fontSize:24,fontWeight:'700',color:'#000b12', marginBottom:4 },
  searchWrap:{
    flexDirection:'row',alignItems:'center',
    backgroundColor:'#f0f0f0',borderRadius:10,paddingHorizontal:12,
  },
  input:{ flex:1,height:40,color:'#000' },

  card:{
    backgroundColor:'#fff',marginHorizontal:16,borderRadius:10,padding:12,
    shadowColor:'#000',shadowOpacity:0.08,shadowOffset:{width:0,height:2},
    shadowRadius:6,elevation:3,
  },
  cardHead:{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' },
  name:{ fontSize:18,fontWeight:'700',color:'#000b12',maxWidth:'85%' },

  body:{ flexDirection:'row',marginTop:8 },
  image:{ width:110,height:110,borderRadius:8 },
  info:{ flex:1,marginLeft:10 },
  txt:{ fontSize:14,color:'#000b12',marginBottom:2 },

  row:{ flexDirection:'row',marginTop:6,justifyContent:'space-between' },
  btn:{ backgroundColor:'#000b12',borderRadius:6,paddingVertical:6,paddingHorizontal:12 },
  btnTxt:{ color:'#fff',fontSize:14 },
});
