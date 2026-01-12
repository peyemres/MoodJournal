import React from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JournalProvider } from './src/context/JournalContext';
import HomeScreen from './src/screens/HomeScreen';
import AddEntryScreen from './src/screens/AddEntryScreen';
import SettingsScreen from './src/screens/SettingsScreen'; 
import { colors } from './src/styles/colors';

const Stack = createNativeStackNavigator();         // NAVIGATION: Stack Navigator (Sayfalar arası yığın yapısı)

export default function App() {
  return (                                          // CONTEXT: Provider tüm uygulamayı sarar, böylece veriye her yerden erişilir
    <JournalProvider>                             
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
            headerTitleAlign: 'center',
            headerShadowVisible: false, 
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={({ navigation }) => ({ 
              title: 'Günlüğüm',
              // 2. SAĞ ÜST KÖŞEYE AYARLAR BUTONU EKLEME
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Settings')}
                  style={{ marginRight: 10 }}
                >
                  {/* Basit bir emoji veya ikon */}
                  <Text style={{ fontSize: 24 }}>⚙️</Text> 
                </TouchableOpacity>
              ),
            })} 
          />

          {/* 3. Ekleme Sayfası */}
          <Stack.Screen 
            name="AddEntry" 
            component={AddEntryScreen} 
            options={{ title: 'Yeni Ekle' }}    
          />
          
          {/* 4. Yeni sayfayı Stack'e ekle */}
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Ayarlar' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </JournalProvider>
  );
}