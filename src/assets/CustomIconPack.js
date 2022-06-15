import React from 'react';
import { Image } from 'react-native';

const IconProvider = (source) => ({
  toReactElement: ({ animation, ...props }) => (
     <Image {...props} source={source}/>
  ),
});

export const CustomIconPack = {
  name: 'customAssets',
  icons: {
    'frienusText': IconProvider(require('../assets/logofrienus.png')),
    'frienus': IconProvider(require('../assets/frienus.png')),
    // ...
  },
};