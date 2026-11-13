import React from 'react';
import { Pressable } from 'react-native';
import { FakeMap } from './FakeMap';
import { CartPin, UserPin } from './Pins';
import type { CartsMapProps } from './CartsMap';

export function CartsMap({ me, carts, selectedId, onSelect }: CartsMapProps) {
  return (
    <FakeMap
      markers={[
        { key: 'me', pos: me, node: <UserPin /> },
        ...carts.map((c) => ({
          key: c.id,
          pos: c.location,
          node: (
            <Pressable accessibilityRole="button" accessibilityLabel={`Pilih gerobak ${c.id}`} onPress={() => onSelect(c)}>
              <CartPin label={'#' + c.id.replace('GRB-', '')} selected={c.id === selectedId} />
            </Pressable>
          ),
        })),
      ]}
    />
  );
}
