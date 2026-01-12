import React, { useContext, useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Platform, 
  ScrollView, 
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { JournalContext } from '../context/JournalContext';

const SettingsScreen = () => {
  // entries verisini de çekiyoruz (İstatistik için)
  const { deleteAllEntries, journalTitle, updateJournalTitle, entries } = useContext(JournalContext);
  
  const [tempTitle, setTempTitle] = useState(journalTitle);

  useEffect(() => {
    setTempTitle(journalTitle);
  }, [journalTitle]);

  // --- İSTATİSTİK HESAPLAMA (Data Processing) ---
  // useMemo: Liste değişmediği sürece tekrar tekrar hesaplama yapmaz (Performans için)
  const stats = useMemo(() => {
    return {
      total: entries.length,
      happy: entries.filter(e => e.mood === '😊').length,
      neutral: entries.filter(e => e.mood === '😐').length,
      sad: entries.filter(e => e.mood === '😢').length,
      angry: entries.filter(e => e.mood === '😡').length,
    };
  }, [entries]);

  const handleSaveTitle = () => {
    if (tempTitle.trim().length === 0) {
      if(Platform.OS === 'web') window.alert("Başlık boş olamaz!");
      else Alert.alert("Hata", "Başlık boş olamaz!");
      return;
    }
    updateJournalTitle(tempTitle);
    
    if(Platform.OS === 'web') window.alert("Başlık güncellendi!");
    else Alert.alert("Başarılı", "Günlük adı değiştirildi.");
  };

  const handleReset = () => {             // FUNCTIONALITY: Kritik işlemler için onay mekanizması
    const title = "Tüm Veriler Silinecek!";
    const message = "Bütün günlüklerin kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misin?";

    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        deleteAllEntries();
        window.alert("Uygulama sıfırlandı.");
      }
    } else {
      Alert.alert(title, message, [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Evet, Hepsini Sil", 
          style: "destructive", 
          onPress: () => {
            deleteAllEntries();
            Alert.alert("Başarılı", "Uygulama tertemiz oldu!");
          }
        }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* 1. YENİ BÖLÜM: İSTATİSTİKLER */}
        <View style={styles.section}>
          <Text style={styles.header}>Genel Bakış</Text>
          <View style={styles.card}>
            <Text style={styles.totalText}>Toplam {stats.total} Anı Biriktirdin</Text>
            
            <View style={styles.statsRow}>
              {/* Mutlu */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😊</Text>
                <Text style={styles.statCount}>{stats.happy}</Text>
              </View>
              {/* Nötr */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😐</Text>
                <Text style={styles.statCount}>{stats.neutral}</Text>
              </View>
              {/* Üzgün */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😢</Text>
                <Text style={styles.statCount}>{stats.sad}</Text>
              </View>
              {/* Kızgın */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😡</Text>
                <Text style={styles.statCount}>{stats.angry}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. BÖLÜM: KİŞİSELLEŞTİRME */}
        <View style={styles.section}>
          <Text style={styles.header}>Kişiselleştirme</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Günlük Adı</Text>
            <TextInput
              style={styles.input}
              value={tempTitle}
              onChangeText={setTempTitle}
              placeholder="Örn: Aytekin'in Günlüğü"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTitle}>
              <Text style={styles.saveButtonText}>ADI GÜNCELLE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. BÖLÜM: HAKKINDA */}
        <View style={styles.section}>
          <Text style={styles.header}>Hakkında</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Uygulama Adı</Text>
            <Text style={styles.value}>Mood Journal</Text>
            <View style={styles.divider} />
            <Text style={styles.label}>Versiyon</Text>
            <Text style={styles.value}>1.2.0 (Pro Sürüm 🚀)</Text>
          </View>
        </View>

        {/* 4. BÖLÜM: TEHLİKELİ BÖLGE */}
        <View style={styles.section}>
          <Text style={[styles.header, { color: '#e53935' }]}>Tehlikeli Bölge</Text>
          <View style={styles.card}>
            <Text style={styles.warningText}>
              Bu işlem tüm kayıtlarını kalıcı olarak siler.
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>TÜM VERİLERİ SIFIRLA</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f8f9fa', padding: 20 },
  section: { marginBottom: 30 },
  header: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10, textTransform: 'uppercase' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }
    }),
  },
  
  // --- İSTATİSTİK STİLLERİ ---
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statEmoji: { fontSize: 28, marginBottom: 5 },
  statCount: { fontSize: 16, fontWeight: 'bold', color: '#6200ee' },

  label: { fontSize: 16, color: '#333', marginBottom: 5 },
  value: { fontSize: 14, color: '#888', marginBottom: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: '#fcfcfc',
    fontSize: 16
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  warningText: { color: '#666', fontSize: 14, marginBottom: 15 },
  resetButton: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2'
  },
  resetButtonText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14 }
});

export default SettingsScreen;