import React from 'react';
import { Image } from 'react-native';

const IconProvider = (source, w, h, mode) => ({
  toReactElement: ({ animation, ...props }) => (
     <Image {...props} source={source} width={w} height={h} resizeMode={mode}/>
  ),
});

export const CustomIconPack = {
  name: 'customAssets',
  icons: {
    'frienusText': IconProvider(require('../assets/logofrienus.png'), 60, 15, 'cover'),
    'frienus': IconProvider(require('../assets/frienus.png'), 60, 60, 'contain'),
    // ...
  },
};