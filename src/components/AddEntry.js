import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { addEntry } from '../store/actions/entries.action';
import {
  getDailyReminderValue,
  getMetricMetaInfo,
  timeToString,
} from '../utils/helpers';
import { purple, white } from '../utils/colors';
import { submitEntry, removeEntry } from '../utils/api';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import UdaciSlider from './UdaciSlider';
import UdaciStepper from './UdaciStepper';

const initialMetric = {
  run: 0,
  bike: 0,
  swim: 0,
  sleep: 0,
  eat: 0,
};

function AddEntry(props) {
  const { alreadyLogged, dispatch, navigation } = props;
  const [metrics, setMetrics] = useState(initialMetric);
  const metricMetaInfo = getMetricMetaInfo();

  const increment = (metric) => {
    const { max, step } = metricMetaInfo[metric];

    setMetrics((prevMetrics) => {
      const count = prevMetrics[metric] + step;
      return {
        ...prevMetrics,
        [metric]: count > max ? max : count,
      };
    });
  };

  const decrement = (metric) => {
    setMetrics((prevMetrics) => {
      const count = prevMetrics[metric] - metricMetaInfo[metric].step;
      return {
        ...prevMetrics,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };

  const slide = (metric, value) => {
    setMetrics({
      ...metrics,
      [metric]: value,
    });
  };

  const submit = () => {
    const key = timeToString();
    const entry = metrics;

    submitEntry({ entry, key }); // Update remote db
    dispatch(addEntry({ [key]: entry })); // Update redux
    setMetrics(initialMetric); // Reset metrics

    goHome();
  };

  const reset = () => {
    const key = timeToString();

    removeEntry(key);
    dispatch(addEntry({ [key]: getDailyReminderValue() }));

    goHome();
  };

  const goHome = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'History',
      })
    );
  };

  if (alreadyLogged) {
    return (
      <View style={styles.center}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
          size={100}
        />
        <Text>You already logged your information for today</Text>
        <TextButton onPress={reset} style={styles.resetBtn}>
          Reset
        </TextButton>
      </View>
    );
  }

  return (
    <View style={styles.conttainer}>
      <DateHeader date={new Date().toLocaleDateString()} />
      {Object.keys(metricMetaInfo).map((metric) => {
        const { getIcon, type, ...rest } = metricMetaInfo[metric];
        const value = metrics[metric];

        return (
          <View key={metric} style={styles.row}>
            {getIcon()}
            {type === 'slider' ? (
              <UdaciSlider
                value={value}
                onChange={(value) => slide(metric, value)}
                {...rest}
              />
            ) : (
              <UdaciStepper
                value={value}
                onDecrement={() => decrement(metric)}
                onIncrement={() => increment(metric)}
                {...rest}
              />
            )}
          </View>
        );
      })}
      <TextButton
        onPress={submit}
        style={
          Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn
        }
      >
        <Text style={styles.submitBtnText}>Submit</Text>
      </TextButton>
    </View>
  );
}

const styles = StyleSheet.create({
  conttainer: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  resetBtn: {
    color: purple,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
});

const mapStateToProps = ({ entries }) => {
  const key = timeToString();

  return {
    alreadyLogged: entries[key] && entries[key].today === undefined,
  };
};

export default connect(mapStateToProps)(AddEntry);
