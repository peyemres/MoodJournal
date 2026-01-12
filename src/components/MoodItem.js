import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native'; // Platform ve Alert eklendi
import { useNavigation } from '@react-navigation/native';
import { JournalContext } from '../context/JournalContext';

// PROPS MANAGEMENT: 'item' prop'unu üst bileşenden (FlatList) alıyoruz
const MoodItem = ({ item }) => {
  const navigation = useNavigation();                   // NAVIGATION: Bileşen içinden sayfalar arası geçiş için hook
  const { deleteEntry } = useContext(JournalContext);

  const handleDeletePress = () => {
    // 1. Durum: Eğer Web tarayıcısındaysak
    if (Platform.OS === 'web') {
      const onay = window.confirm("Bu günlüğü silmek istediğine emin misin?");
      if (onay) {
        deleteEntry(item.id);
      }
    } 
    // 2. Durum: Eğer Telefonda (iOS/Android) isek
    else {
      Alert.alert(
        "Siliniyor",
        "Bu günlüğü silmek istediğine emin misin?",
        [
          { text: "Vazgeç", style: "cancel" },
          { 
            text: "Sil", 
            style: "destructive", 
            onPress: () => deleteEntry(item.id) 
          }
        ]
      );
    }
  };

  const handleEditPress = () => {                       // NAVIGATION: Veriyi parametre olarak gönderiyoruz (Data passing)
    navigation.navigate('AddEntry', { entry: item });
  };

  return (
    <View style={styles.card}>
    {/* YENİ: Eğer favoriyse sağ üst köşeye minik yıldız koy */}
      {item.isFavorite && (
        <View style={styles.favoriteBadge}>
          <Text style={{ fontSize: 12 }}>⭐</Text>
        </View>
      )}

      <View style={styles.moodContainer}>
        <Text style={styles.moodEmoji}>{item.mood}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.text} numberOfLines={2}>{item.text}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleEditPress} style={styles.editBtn}>
          <Text style={styles.btnText}>DÜZENLE</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleDeletePress} style={styles.deleteBtn}>
          <Text style={styles.btnText}>SİL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',

    // Hem Web hem Mobil için gölge ayarı
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' } 
    })
  },

  // YENİ: Yıldız Rozeti Stili
  favoriteBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FFF9C4', // Çok açık sarı zemin
    padding: 2,
    borderRadius: 10,
    zIndex: 1
  },
  
  moodContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 50,
    marginRight: 10
  },
  moodEmoji: { fontSize: 28 },
  textContainer: { flex: 1, marginRight: 10 },
  date: { color: '#888', fontSize: 11, marginBottom: 4 },
  text: { fontSize: 16, fontWeight: '600', color: '#333' },
  actions: { 
    flexDirection: 'column', 
    gap: 8, 
    justifyContent: 'center' 
  },
  editBtn: { 
    backgroundColor: '#6200ee', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20, 
    alignItems: 'center',
    // Web gölgesi
    ...Platform.select({
       web: { boxShadow: '0px 2px 4px rgba(98, 0, 238, 0.3)' }
    })
  },
  deleteBtn: { 
    backgroundColor: '#e53935', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20, 
    alignItems: 'center',
    // Web gölgesi
    ...Platform.select({
       web: { boxShadow: '0px 2px 4px rgba(229, 57, 53, 0.3)' }
    })
  },
  btnText: { 
    fontSize: 11, 
    color: '#fff', 
    fontWeight: 'bold',
    textTransform: 'uppercase' 
  }
});

export default MoodItem;