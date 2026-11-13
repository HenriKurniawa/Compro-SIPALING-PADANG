import React from 'react';
import { FakeMap } from './FakeMap';
import { CartPin, UserPin } from './Pins';
import type { RouteMapProps } from './RouteMap';

export function RouteMap({ cart, cartLabel, dest, destLabel }: RouteMapProps) {
  return (
    <FakeMap
      route={dest ? [cart, dest] : undefined}
      markers={[
        { key: 'cart', pos: cart, node: <CartPin label={cartLabel} selected /> },
        ...(dest ? [{ key: 'dest', pos: dest, node: <UserPin label={destLabel} /> }] : []),
      ]}
    />
  );
}
