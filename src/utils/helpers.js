import React from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { blue, lightPurp, orange, pink, red, white } from './colors';

const NOTIFICATOIN_STORAGE_KEY = 'UdaciFitness:notification';

export function isBetween(num, x, y) {
  if (num >= x && num <= y) {
    return true;
  }

  return false;
}

export function calculateDirection(heading) {
  let direction = '';

  if (isBetween(heading, 0, 22.5)) {
    direction = 'North';
  } else if (isBetween(heading, 22.5, 67.5)) {
    direction = 'North East';
  } else if (isBetween(heading, 67.5, 112.5)) {
    direction = 'East';
  } else if (isBetween(heading, 112.5, 157.5)) {
    direction = 'South East';
  } else if (isBetween(heading, 157.5, 202.5)) {
    direction = 'South';
  } else if (isBetween(heading, 202.5, 247.5)) {
    direction = 'South West';
  } else if (isBetween(heading, 247.5, 292.5)) {
    direction = 'West';
  } else if (isBetween(heading, 292.5, 337.5)) {
    direction = 'North West';
  } else if (isBetween(heading, 337.5, 360)) {
    direction = 'North';
  } else {
    direction = 'Calculating';
  }

  return direction;
}

export function timeToString(time = Date.now()) {
  const date = new Date(time);
  const todayUTC = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return todayUTC.toISOString().split('T')[0];
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 5,
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});

export function getMetricMetaInfo(metric) {
  const info = {
    run: {
      displayName: 'Run',
      max: 50,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: red }]}>
            <MaterialIcons name='directions-run' color={white} size={35} />
          </View>
        );
      },
    },
    bike: {
      displayName: 'Bike',
      max: 100,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: orange }]}>
            <MaterialCommunityIcons name='bike' color={white} size={32} />
          </View>
        );
      },
    },
    swim: {
      displayName: 'Swim',
      max: 9900,
      unit: 'meters',
      step: 100,
      type: 'steppers',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: blue }]}>
            <MaterialCommunityIcons name='swim' color={white} size={35} />
          </View>
        );
      },
    },
    sleep: {
      displayName: 'Sleep',
      max: 24,
      unit: 'hours',
      step: 1,
      type: 'slider',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: lightPurp }]}>
            <FontAwesome name='bed' color={white} size={30} />
          </View>
        );
      },
    },
    eat: {
      displayName: 'Eat',
      max: 10,
      unit: 'ratings',
      step: 1,
      type: 'slider',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: pink }]}>
            <MaterialCommunityIcons name='food' color={white} size={35} />
          </View>
        );
      },
    },
  };

  return typeof metric === 'undefined' ? info : info[metric];
}

export function getDailyReminderValue() {
  return {
    today: "Don't forget to log your data today!",
  };
}

export function formatDate(date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${
    months[date.getUTCMonth()]
  } ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function clearLocalNotification() {
  return AsyncStorage.removeItem(NOTIFICATOIN_STORAGE_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );
}

function createNotification() {
  return {
    title: 'Log your stats!',
    body: "Don't forget to log your stats for today!",
    sound: true,
    vibrate: true,
    sticky: false,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  };
}

export async function setLocalNotification() {
  const item = await AsyncStorage.getItem(NOTIFICATOIN_STORAGE_KEY);
  const data = JSON.parse(item);

  if (data === null) {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === 'granted') {
      await Notifications.cancelAllScheduledNotificationsAsync();

      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(20);
      tomorrow.setMinutes(0);

      // New Notification API does not allow repeat 'daily' at specific dates
      // For now, repeat every 24 hours
      // TODO: Set notification to repeat at 8:00am everyday
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: createNotification(),
        trigger: {
          hour: 23,
          minute: 59,
          repeats: true,
        },
      });

      AsyncStorage.setItem(
        NOTIFICATOIN_STORAGE_KEY,
        JSON.stringify(notificationId)
      );
    }
  }
}
