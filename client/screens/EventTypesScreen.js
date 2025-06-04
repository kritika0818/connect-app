import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const BTN_WIDTH = width - 40;

export default function EventTypesScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!auth.currentUser) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        // Fetch all categories from 'categories' collection
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        if (categoriesSnapshot.empty) {
          setCategories([]);
        } else {
          const cats = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCategories(cats);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleExpand = async id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Collapse if same category clicked again
    if (expanded === id) {
      setExpanded(null);
      return;
    }

    // Check if types already loaded for this category
    const cat = categories.find(c => c.id === id);

    if (cat?.types) {
      setExpanded(id);
      return;
    }

    setLoading(true);
    try {
      // Correct way to get subcollection 'types' under a category document
      const typesCollectionRef = collection(db, 'categories', id, 'types');
      const typesSnapshot = await getDocs(typesCollectionRef);

      const typesArr = typesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Update categories with loaded types
      setCategories(prev =>
        prev.map(c => (c.id === id ? { ...c, types: typesArr } : c))
      );
      setExpanded(id);
    } catch (err) {
      console.error('Error loading event types:', err);
      setError('Could not load event types.');
    } finally {
      setLoading(false);
    }
  };

  const CategoryButton = ({ id, label, open }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.catBtn, open && styles.catBtnOpen]}
      onPress={() => handleExpand(id)}
    >
      <Text style={[styles.catTxt, open && styles.catTxtOpen]}>{label}</Text>
      <Ionicons
        name={open ? 'chevron-up' : 'chevron-down'}
        size={22}
        color={open ? '#0066ff' : '#666'}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );

  const TypeRow = ({ item }) => (
    <TouchableOpacity
      style={styles.typeRow}
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to route, fallback to alert if no route provided
        if (item.route) {
          navigation.navigate(item.route);
        } else {
          alert('No route defined for this event type.');
        }
      }}
    >
      <Text style={styles.typeTxt}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#555" />
    </TouchableOpacity>
  );

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
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No event categories yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {categories.map(cat => (
        <View key={cat.id}>
          <CategoryButton id={cat.id} label={cat.label} open={expanded === cat.id} />
          {expanded === cat.id && (
            cat.types && cat.types.length > 0 ? (
              <View style={styles.listWrap}>
                {cat.types.map(t => <TypeRow key={t.id} item={t} />)}
              </View>
            ) : (
              <Text style={styles.emptyTxt}>No event types found.</Text>
            )
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc', paddingHorizontal: 20, paddingTop: 25 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  catBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: BTN_WIDTH,
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  catBtnOpen: { backgroundColor: '#e6f0ff', borderColor: '#0066ff' },
  catTxt: { fontSize: 22, fontWeight: '700', color: '#333' },
  catTxtOpen: { color: '#0066ff' },
  listWrap: { marginBottom: 25, marginTop: -4, paddingHorizontal: 15 },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  typeTxt: { fontSize: 16, color: '#222' },
  emptyTxt: { paddingLeft: 25, color: '#666', marginVertical: 8, fontSize: 14 },
});
