import type { ImageSourcePropType } from 'react-native';
import type { MenuItem } from '../types';

// Foto contoh untuk mode demo. Di backend asli, pakai imageUrl dari server.
const LOCAL: Record<string, ImageSourcePropType> = {
  rendang: require('../../assets/menu/rendang.jpg'),
  dendeng: require('../../assets/menu/dendeng.jpg'),
  gulai: require('../../assets/menu/gulai.jpg'),
  ayampop: require('../../assets/menu/ayampop.jpg'),
  telor: require('../../assets/menu/telor.jpg'),
  perkedel: require('../../assets/menu/perkedel.jpg'),
};

export function menuImage(m: MenuItem): ImageSourcePropType | undefined {
  if (m.imageUrl) return { uri: m.imageUrl };
  return LOCAL[m.id];
}
