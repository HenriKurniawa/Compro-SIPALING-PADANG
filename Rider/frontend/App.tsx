import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SessionProvider, useSession } from './src/context/SessionContext';
import type { RootStackParamList } from './src/navigation';
import { colors } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import DeliveryScreen from './src/screens/DeliveryScreen';
import OfflineScreen from './src/screens/OfflineScreen';
import StockScreen from './src/screens/StockScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.cream, primary: colors.maroon },
};

function Routes() {
  const { rider } = useSession();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {rider ? (
        <>
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Delivery" component={DeliveryScreen} />
          <Stack.Screen name="Offline" component={OfflineScreen} />
          <Stack.Screen name="Stock" component={StockScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

const webOuter = { flex: 1, backgroundColor: '#2A1C16', alignItems: 'center' as const };
const webPhone = { flex: 1, width: '100%' as const, maxWidth: 430, overflow: 'hidden' as const, backgroundColor: colors.cream };

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.cream} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SessionProvider>
        {/* Di browser, tampilkan seukuran layar HP di tengah halaman. */}
        <View style={Platform.OS === 'web' ? webOuter : { flex: 1 }}>
          <View style={Platform.OS === 'web' ? webPhone : { flex: 1 }}>
            <NavigationContainer theme={navTheme}>
              <StatusBar style="light" />
              <Routes />
            </NavigationContainer>
          </View>
        </View>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
