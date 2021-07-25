import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import { View } from 'react-native';
import AddEntry from './AddEntry';
import History from './History';

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <View style={{ height: 20 }} />
        <History />
      </View>
    </Provider>
  );
}
