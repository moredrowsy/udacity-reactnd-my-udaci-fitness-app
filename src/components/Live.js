import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Foundation } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { purple, white } from '../utils/colors';
import { calculateDirection } from '../utils/helpers';

function Live() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState(null);
  const [direction, setDirection] = useState('');
  const [locSubscription, setLocSubscription] = useState(null);
  const bounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    askPersmission();
    return () => {
      if (locSubscription && locSubscription.remove) {
        locSubscription.remove();
        setLocSubscription(null);
      }
    };
  }, [askPersmission]);

  const askPersmission = useCallback(async () => {
    const hasLocService = await Location.hasServicesEnabledAsync();

    if (hasLocService) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setStatus(status);

      if (status === 'granted') {
        await setLocation();
      }
    } else {
      setStatus('undetermined');
    }
  }, []);

  const setLocation = useCallback(async () => {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1,
        distanceInterval: 1,
      },
      ({ coords }) => {
        const newDirection = calculateDirection(coords.heading);
        if (newDirection !== direction) {
          Animated.sequence([
            Animated.timing(bounce, {
              duration: 200,
              toValue: 1.04,
              useNativeDriver: true,
            }),
            Animated.spring(bounce, {
              toValue: 1,
              friction: 4,
              useNativeDriver: true,
            }),
          ]).start();
        }

        setCoords(coords);
        setDirection(newDirection);
      }
    );
    setLocSubscription(subscription);
  }, []);

  if (!status) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color={purple} />
      </View>
    );
  } else if (status === 'denied') {
    return (
      <View style={styles.center}>
        <Foundation name='alert' size={30} />
        <Text style={styles.textCenter}>
          You denied location. You can fix by visiting your settings and
          enabling location services for this app.
        </Text>
      </View>
    );
  } else if (status === 'undetermined') {
    return (
      <View style={styles.center}>
        <Foundation name='alert' size={30} />
        <Text style={styles.textCenter}>
          You need to enable location services for this app.
        </Text>
        <TouchableOpacity onPress={askPersmission} style={styles.btn}>
          <Text style={styles.btnText}>Enable</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.directionContainer}>
          <Text style={styles.header}>You're heading</Text>
          <Animated.Text
            style={[styles.direction, { transform: [{ scale: bounce }] }]}
          >
            {direction}
          </Animated.Text>
        </View>
        <View style={styles.metricContainer}>
          <View style={styles.metric}>
            <Text style={[styles.header, { color: white }]}>Altitude</Text>
            <Text style={[styles.subHeader, { color: white }]}>
              {coords && Math.round(coords.altitude * 3.2808)} Feet
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.header, { color: white }]}>Speed</Text>
            <Text style={[styles.subHeader, { color: white }]}>
              {coords && Math.round(coords.speed * 2.2369).toFixed(1)} MPH
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  textCenter: {
    textAlign: 'center',
  },
  btn: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  btnText: { color: white, fontSize: 20 },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  direction: {
    color: purple,
    fontSize: 120,
    textAlign: 'center',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple,
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Live;
