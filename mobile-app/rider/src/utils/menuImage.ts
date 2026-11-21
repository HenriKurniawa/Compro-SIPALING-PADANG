import type { ImageSourcePropType } from 'react-native';

export const LOCAL_MENU_IMAGES: Record<string, ImageSourcePropType> = {
  rendang: require('../../assets/menu/rendang.jpg'),
  dendeng: require('../../assets/menu/dendeng.jpg'),
  gulai: require('../../assets/menu/gulai.jpg'),
  ayampop: require('../../assets/menu/ayampop.jpg'),
  telor: require('../../assets/menu/telor.jpg'),
  perkedel: require('../../assets/menu/perkedel.jpg'),
};

export function getMenuSource(item: { imageUrl?: string; id: string }) {
  if (item.imageUrl && item.imageUrl.startsWith('http')) {
    return { uri: item.imageUrl };
  }
  return LOCAL_MENU_IMAGES[item.id] ?? require('../../assets/menu/rendang.jpg');
}

export const menuImage = getMenuSource;
