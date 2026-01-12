import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { JournalContext } from '../context/JournalContext';
// STYLING: Renkleri tek merkezden yönetmek için import ettik
import { colors } from '../styles/colors';

const AddEntryScreen = ({ navigation, route }) => {
  const { addEntry, editEntry } = useContext(JournalContext);
  const entryToEdit = route.params?.entry; 

  const [text, setText] = useState(entryToEdit ? entryToEdit.text : '');
  const [mood, setMood] = useState(entryToEdit ? entryToEdit.mood : '😐');
  const [isFavorite, setIsFavorite] = useState(entryToEdit ? entryToEdit.isFavorite : false);

  useEffect(() => {
    navigation.setOptions({
      title: entryToEdit ? 'Günlüğünü Düzenle' : 'Yeni Ekle',
    });
  }, [navigation, entryToEdit]);

  const handleSave = () => {
    if (text.trim().length === 0) {
      Platform.OS === 'web' ? window.alert("Yazı yazmalısın!") : alert("Yazı yazmalısın!");
      return;
    }
    if (entryToEdit) {
      editEntry(entryToEdit.id, mood, text, isFavorite);
    } else {
      addEntry(mood, text, isFavorite);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }} // Arka plan hafif gri
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* --- YENİ TASARIM: YAN YANA İKİ KUTU --- */}
        <View style={styles.headerRow}>
          
          {/* 1. KUTU: BAŞLIK KUTUSU (Esnek genişlik) */}
          <View style={styles.titleBox}>
            <Text style={styles.label}>
              {entryToEdit ? 'Duygun değişti mi?' : 'Ruh Halin Nasıl?'}
            </Text>
          </View>
          
          {/* 2. KUTU: YILDIZ KUTUSU (Sabit genişlik - Kare) */}
          <TouchableOpacity 
            // STYLING: Eğer favori ise kutunun kenar rengini de sarı yapıyoruz
            style={[styles.starBox, isFavorite && styles.starBoxActive]} 
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.7}
          >
            <Text style={[styles.starIcon, isFavorite && styles.starActive]}>
              {isFavorite ? '⭐' : '☆'} 
            </Text>
          </TouchableOpacity>

        </View>

        {/* EMOJİ SEÇİMİ */}
        <View style={styles.emojiContainer}>
          {['😊', '😐', '😢', '😡'].map((emoji) => (
            <TouchableOpacity key={emoji} onPress={() => setMood(emoji)}>
               <Text style={[styles.emoji, mood === emoji && styles.selectedEmoji]}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* METİN GİRİŞİ */}
        <TextInput
          style={styles.input}
          placeholder="Neler oldu?"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={4} 
        />

        {/* KAYDET BUTONU */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{entryToEdit ? "GÜNCELLE" : "KAYDET"}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  
  // --- HEADER ROW (Üst Satır Düzeni) ---
  headerRow: { 
    flexDirection: 'row',  // Yan yana diz
    alignItems: 'stretch', // Yükseklikleri eşitle
    marginBottom: 30,      // Alt kısımla mesafe
    gap: 15,               // İki kutu arası boşluk
  },

  // 1. BAŞLIK KUTUSU TASARIMI
  titleBox: {
    flex: 1, // Kalan tüm boşluğu kapla
    backgroundColor: colors.white,
    paddingVertical: 15,    // Dikey dolgu
    paddingHorizontal: 20,  // Yatay dolgu
    borderRadius: 20,       // Yuvarlak köşeler
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    // Gölge Efekti
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' } 
    }),
  },
  label: { 
    fontSize: 20,      // Yazıyı büyüttük
    fontWeight: 'bold', 
    color: colors.text 
  },

  // 2. YILDIZ KUTUSU TASARIMI
  starBox: {
    width: 70, // Genişlik ve yükseklik yakın olsun (Karemsi)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    // Gölge Efekti
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' } 
    }),
  },
  // Favori seçiliyken kutunun kendisi de değişsin
  starBoxActive: {
    borderColor: '#FFD700',      // Altın sarısı çerçeve
    backgroundColor: '#FFFDE7',  // Çok açık sarı zemin
  },
  starIcon: { fontSize: 32, color: '#ccc' },
  starActive: { color: '#FFD700' }, // İkonun kendisi parlasın

  // --- DİĞER STİLLER ---
  emojiContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  emoji: { fontSize: 40, opacity: 0.4 },
  selectedEmoji: { opacity: 1, transform: [{ scale: 1.3 }] },
  input: { 
    borderWidth: 1, borderColor: colors.inputBorder, padding: 15, borderRadius: 15,
    height: 150, marginBottom: 30, textAlignVertical: 'top', fontSize: 16, backgroundColor: colors.white,
  },
  saveButton: {
    backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3 },
      android: { elevation: 6 },
      web: { boxShadow: `0px 4px 10px ${colors.primary}4d` },
    }),
  },
  saveButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }
});

export default AddEntryScreen;