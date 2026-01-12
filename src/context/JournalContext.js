import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // FUNCTIONALITY: Verileri kalıcı hafızada tutmak için AsyncStorage kütüphanesi

export const JournalContext = createContext();        // CONTEXT: Veri havuzunu oluşturuyoruz

export const JournalProvider = ({ children }) => {    // STATE MANAGEMENT: Günlük listesini tutan ana state
  const [entries, setEntries] = useState([]);
  
  const [journalTitle, setJournalTitle] = useState('Günlüğüm');     // STATE MANAGEMENT: Uygulama başlığını tutan state (Ayarlardan değişir)

  useEffect(() => {                                   // FUNCTIONALITY (Persistence): Uygulama ilk açıldığında çalışır
    const loadData = async () => {
      try {
        // Günlükleri ve Başlığı yükle  
        const savedData = await AsyncStorage.getItem('journal_data');       // Hafızadan verileri çekiyoruz (Await ile asenkron işlem)
        const savedTitle = await AsyncStorage.getItem('journal_title');
 
        if (savedData !== null) setEntries(JSON.parse(savedData));          // Eğer veri varsa JSON'dan parse edip State'e yüklüyoruz
        if (savedTitle !== null) setJournalTitle(savedTitle);

      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
      }
    };
    loadData();
  }, []);       // [] boş olduğu için sadece bir kez çalışır.


  const saveData = async (newEntries) => {                        // Yardımcı Fonksiyon: Hem State'i hem Hafızayı aynı anda günceller
    try {
      setEntries(newEntries);                                                     // Ekranı anında güncelle (React)
      await AsyncStorage.setItem('journal_data', JSON.stringify(newEntries));     // Arka planda kaydet
    } catch (error) {
      console.error("Veri kaydedilirken hata:", error);
    }
  };

  // Başlığı Güncelleme ve Kaydetme Fonksiyonu
  const updateJournalTitle = async (newTitle) => {
    try {
      setJournalTitle(newTitle); // Ekranı güncelle
      await AsyncStorage.setItem('journal_title', newTitle); // Hafızaya yaz
    } catch (error) {
      console.error("Başlık kaydedilemedi:", error);
    }
  };

// Yeni günlük ekleme Fonksiyonu
  const addEntry = (mood, text, isFavorite = false) => {
    const newEntry = {
      id: Math.random().toString(),                   // Benzersiz ID üretimi
      mood,
      text,
      isFavorite,                                     // Favori ekleme
      date: new Date().toLocaleDateString(),          // Bugünün tarihi
    };                                          
    const updatedEntries = [newEntry, ...entries];    // Spread operator (...) ile eski listeyi alıp yenisini ekliyoruz
    saveData(updatedEntries);                         // (React'te state immutable olduğu için push kullanmıyoruz)
  };

// Silme işlemi Fonksiyonu  
  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);    // Filter metodu ile ID'si eşleşmeyeni tut, eşleşeni at
    saveData(updatedEntries);
  };

// Düzenleme işlemi Fonksiyonu
  const editEntry = (id, newMood, newText, newIsFavorite) => {
    const updatedEntries = entries.map(entry =>           // Map metodu ile tüm listeyi gez, ID eşleşirse içeriği değiştir
      entry.id === id ? { ...entry, mood: newMood, text: newText, isFavorite: newIsFavorite } : entry 
    );
    saveData(updatedEntries);
  };

// Tüm verileri temizleme (Ayarlar için)
  const deleteAllEntries = async () => {
    try {
      setEntries([]); 
      await AsyncStorage.removeItem('journal_data'); 
    } catch (error) {
      console.error("Sıfırlama hatası:", error);
    }
  };

  return (
    // Context Provider ile verileri alt bileşenlere dağıtıyoruz
    <JournalContext.Provider value={{ entries, addEntry, deleteEntry, editEntry, deleteAllEntries, journalTitle, updateJournalTitle }}>
      {children}
    </JournalContext.Provider>
  );
};