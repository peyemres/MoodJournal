import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { JournalContext } from '../context/JournalContext';
import MoodItem from '../components/MoodItem';
import { colors } from '../styles/colors'; 

const HomeScreen = ({ navigation }) => {
  // 1. Context'ten hem günlükleri hem de Başlığı (journalTitle) çekiyoruz
  const { entries, journalTitle } = useContext(JournalContext);
  
  // 2. Arama metnini tutacak TEK State
  const [searchText, setSearchText] = useState('');

  // 3. Favorileri Göster / Gizle State'i
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // 4. BAŞLIK GÜNCELLEME (Ayarlardan gelen isim)
  useEffect(() => {
    navigation.setOptions({
      title: journalTitle, // Başlığı dinamik yap
    });
  }, [navigation, journalTitle]);

  // YARDIMCI FONKSİYON: Butonun takılmasını önlemek için state'i güvenli değiştiriyoruz
  const toggleFavoriteFilter = () => {
    setShowFavoritesOnly(prev => !prev);
  };

  // 5. FİLTRELEME MANTIĞI
  const filteredEntries = entries.filter((item) => {
    // Girilen metin, günlük metninde VEYA emojide geçiyor mu?
    
    // Önce metin araması
    const textMatch = item.text.toLowerCase().includes(searchText.toLowerCase());
    const moodMatch = item.mood.includes(searchText);
    const isSearchMatch = textMatch || moodMatch;

    // Sonra favori filtresi
    if (showFavoritesOnly) {
      // Hem arama sonucuna uymalı HEM DE favori olmalı
      return isSearchMatch && item.isFavorite === true; 
    }
    
    // Favori filtresi kapalıysa sadece aramaya bak
    return isSearchMatch; 
  });

  return (
    <View style={styles.container}>
      
      {/* ÜST BAR: ARAMA ÇUBUĞU VE FAVORİ FİLTRESİ (Sadece kayıt varsa göster) */}
      {entries.length > 0 && (
        <View style={styles.topBarContainer}>
          
          {/* Arama Kutusu (Flex: 1 diyerek kalan alanı kaplar) */}
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ara... (örn: tatil veya 😊)"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={colors.textLight}
            />
          </View>

          {/* Favori Filtre Butonu (Sabit genişlik) */}
          <TouchableOpacity 
            style={[styles.filterButton, showFavoritesOnly && styles.filterButtonActive]} 
            onPress={toggleFavoriteFilter} // Güvenli fonksiyonu kullan
            activeOpacity={0.7}
          >
            <Text style={[styles.filterStar, showFavoritesOnly && styles.filterStarActive]}>
              {showFavoritesOnly ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {/* ŞARTLI GÖSTERİM SENARYOLARI */}
      
      {entries.length === 0 ? (
        // SENARYO A: Hiç kayıt yoksa
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyEmoji}>👋</Text>
          <Text style={styles.emptyTitle}>Merhaba! Günlüğe hoş geldin!</Text>
          <Text style={styles.emptySubtitle}>
            Umarım her şey harika gidiyordur. 😊
          </Text>
        </View>

      ) : filteredEntries.length === 0 ? (

        // SENARYO B: Arama sonucu bulunamadı
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Sonuç Bulunamadı</Text>
          <Text style={styles.emptySubtitle}>
             {showFavoritesOnly 
              ? "Favorilerinde böyle bir kayıt yok." 
              : `"${searchText}" ile eşleşen bir günlüğün yok.`}
          </Text>
          
          {/* KULLANICI DOSTU EKLEME: Sıkışırsa buradaki yazıya basıp da filtreyi kapatabilsin */}
          {showFavoritesOnly && (
            <TouchableOpacity onPress={toggleFavoriteFilter} style={{ marginTop: 15, padding: 10 }}>
               <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Filtreyi Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

      ) : (
        // SENARYO C: Listeyi Göster
        <FlatList
          // FLATLIST: Büyük listeleri performanslı göstermek için
          data={filteredEntries} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MoodItem item={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Yeni Ekle Butonu */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddEntry')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>+ Yeni Ekle</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  topBarContainer: {
    flexDirection: 'row', // Yan yana diz
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10, // Arama ve Yıldız arası boşluk
    // KRİTİK DÜZELTME: Bu katmanı en üste çıkartıyoruz (z-index).
    // Böylece alttaki "Boş Sayfa" uyarısı yukarı kaysa bile butonun üzerine çıkamaz.
    zIndex: 10, 
    backgroundColor: colors.background, // Arka plan şeffaf olmasın ki alttakiler görünmesin
  },
  searchWrapper: {
    flex: 1, // Mümkün olan tüm alanı kapla
  },
  searchInput: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', outlineStyle: 'none' } 
    }),
  },
  
  // Filtre Butonu Stilleri
  filterButton: {
    width: 50, // Kare olsun
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' } 
    }),
  },
  filterButtonActive: {
    backgroundColor: '#FFF9C4', // Açık sarı arka plan (Aktifken)
    borderColor: '#FFD700'
  },
  filterStar: {
    fontSize: 24,
    color: '#ccc', // Pasif gri
    fontWeight: 'bold'
  },
  filterStarActive: {
    color: '#FFD700', // Parlak sarı
  },

  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -50 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  emptySubtitle: { fontSize: 16, color: colors.textLight, textAlign: 'center', marginTop: 10, paddingHorizontal: 40 },
  listContent: { padding: 20, paddingBottom: 100 },
  floatingButton: {
    position: 'absolute',
    bottom: 30, right: 30, left: 30,
    backgroundColor: colors.primary,
    padding: 15, borderRadius: 30, alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 8 },
      android: { elevation: 8 },
      web: { boxShadow: `0px 4px 12px ${colors.primary}66` }
    }),
  },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' }
});

export default HomeScreen;