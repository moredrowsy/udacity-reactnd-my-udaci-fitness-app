import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import { Platform, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { purple, white } from '../utils/colors';
import AddEntry from './AddEntry';
import EntryDetails from './EntryDetails';
import History from './History';
import Live from './Live';
import UdaciStatusBar from './UdaciStatusBar';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const TabsNavigator = () => (
  <Tabs.Navigator
    tabBarOptions={{
      activeTintColor: Platform.OS === 'ios' ? purple : white,
      style: {
        height: 56,
        backgroundColor: Platform.OS === 'ios' ? white : purple,
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
      },
    }}
  >
    <Tabs.Screen
      name='History'
      component={History}
      options={{
        title: 'History',
        tabBarIcon: ({ color }) => (
          <Ionicons name='ios-bookmarks' color={color} size={30} />
        ),
      }}
    />
    <Tabs.Screen
      name='AddEntry'
      component={AddEntry}
      options={{
        title: 'Add Entry',
        tabBarIcon: ({ color }) => (
          <FontAwesome name='plus-square' color={color} size={30} />
        ),
      }}
    />
    <Tabs.Screen
      name='Live'
      component={Live}
      options={{
        title: 'Live',
        tabBarIcon: ({ color }) => (
          <Ionicons name='ios-speedometer' color={color} size={30} />
        ),
      }}
    />
  </Tabs.Navigator>
);

const StackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitleAlign: 'center',
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,
      },
    }}
  >
    <Stack.Screen
      name='History'
      component={TabsNavigator}
      options={{ title: 'History', headerShown: false }}
    />
    <Stack.Screen
      name='EntryDetails'
      component={EntryDetails}
      options={{
        title: 'Entry Details',
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </View>
    </Provider>
  );
}
