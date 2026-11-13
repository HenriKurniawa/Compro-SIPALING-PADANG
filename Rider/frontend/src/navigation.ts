import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Orders: undefined;
  Delivery: { orderId: string };
  Offline: undefined;
  Stock: undefined;
  History: undefined;
};

export type ScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
