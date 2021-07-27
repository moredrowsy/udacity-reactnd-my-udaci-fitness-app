import React from 'react';
import { StatusBar, View } from 'react-native';
import Consants from 'expo-constants';

export default function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Consants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}
