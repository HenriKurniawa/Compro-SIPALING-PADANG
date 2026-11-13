import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
  History: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Menu: undefined;
  Checkout: undefined;
  Track: { justCreated?: boolean } | undefined;
  Points: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
};

export type ScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
