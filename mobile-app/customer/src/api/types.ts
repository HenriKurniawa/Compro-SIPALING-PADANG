import type { Cart, Customer, LatLng, Loyalty, MenuItem, Order, OrderType } from '../types';

export interface CustomerApi {
  // UC-01, UC-02, UC-03, UC-04
  login(phone: string, password: string): Promise<{ token: string; customer: Customer }>;
  requestRegisterOtp(name: string, phone: string): Promise<void>;
  verifyRegisterOtp(phone: string, code: string): Promise<{ registrationToken: string }>;
  completeRegistration(registrationToken: string, password: string): Promise<void>;
  logout(): Promise<void>;

  // UC-23, UC-24 (guest boleh)
  getNearbyCarts(pos: LatLng): Promise<Cart[]>;
  getCartMenu(cartId: string): Promise<MenuItem[]>;

  // UC-25, UC-26, UC-27, UC-28
  createOrder(input: {
    cartId: string;
    type: OrderType;
    items: { menuId: string; qty: number }[];
    location?: LatLng;
    address?: string;
    note?: string;
  }): Promise<Order>;
  getOrder(id: string): Promise<Order>;
  getActiveOrder(): Promise<Order | null>;
  cancelOrder(id: string): Promise<void>;

  // UC-29 riwayat, UC-30 loyalitas
  getHistory(): Promise<Order[]>;
  getLoyalty(): Promise<Loyalty>;

  // UC-05, UC-06
  updateProfile(input: { name: string }): Promise<Customer>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
  deleteAccount(password: string): Promise<void>;
}

/** Minimum pembelian untuk Call Riders (SDD UC-26). Nilai final ikut keputusan mitra. */
export const MIN_ORDER_ANTAR = 25000;
/** Radius pencarian gerobak (km). */
export const SEARCH_RADIUS_KM = 1.5;
