import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SessionProvider, useSession } from './src/context/SessionContext';
import { OrderProvider } from './src/context/OrderContext';
import type { RootStackParamList, TabParamList } from './src/navigation';
import { colors, fonts } from './src/theme';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AccountScreen from './src/screens/AccountScreen';
import MenuScreen from './src/screens/MenuScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import TrackScreen from './src/screens/TrackScreen';
import PointsScreen from './src/screens/PointsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.cream, primary: colors.maroon },
};

const TAB_ICONS: Record<keyof TabParamList, React.ComponentProps<typeof Feather>['name']> = {
  Home: 'home',
  History: 'clock',
  Account: 'user',
};

function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.maroon,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.cream2, height: 62 + insets.bottom, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
        tabBarIcon: ({ color, size }) => <Feather name={TAB_ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Riwayat' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'Akun' }} />
    </Tab.Navigator>
  );
}

function Routes() {
  const { customer } = useSession();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {customer ? (
        <>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Track" component={TrackScreen} />
          <Stack.Screen name="Points" component={PointsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
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
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1600);
    return () => clearTimeout(t);
  }, []);

  let body: React.ReactNode;
  if (!fontsLoaded) {
    body = (
      <View style={{ flex: 1, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.cream} />
      </View>
    );
  } else if (splash) {
    body = <SplashScreen />;
  } else {
    body = (
      <SessionProvider>
        <OrderProvider>
          <NavigationContainer theme={navTheme}>
            <Routes />
          </NavigationContainer>
        </OrderProvider>
      </SessionProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {/* Di browser, tampilkan seukuran layar HP di tengah halaman. */}
      <View style={Platform.OS === 'web' ? webOuter : { flex: 1 }}>
        <View style={Platform.OS === 'web' ? webPhone : { flex: 1 }}>{body}</View>
      </View>
    </SafeAreaProvider>
  );
}
