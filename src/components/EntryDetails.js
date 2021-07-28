import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { addEntry } from '../store/actions/entries.action';

import { removeEntry } from '../utils/api';
import { white } from '../utils/colors';
import {
  formatDate,
  getDailyReminderValue,
  timeToString,
} from '../utils/helpers';
import MetricCard from './MetricCard';
import TextButton from './TextButton';

function EntryDetails({ navigation, dispatch, entryId, metrics }) {
  const date = formatDate(new Date(entryId));

  useLayoutEffect(() => {
    navigation.setOptions({ title: date });
  }, [navigation]);

  const reset = () => {
    // Reset entry by setting entry to null or reminder value if it's today
    dispatch(
      addEntry({
        [entryId]: timeToString() === entryId ? getDailyReminderValue() : null,
      })
    );
    navigation.goBack();
    removeEntry(entryId);
  };

  return (
    <View style={styles.container}>
      {metrics && !metrics.today && (
        <View style={{ flex: 1 }}>
          <MetricCard date={date} metrics={metrics} />
          <TextButton onPress={reset} style={styles.resetBtn}>
            Reset
          </TextButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
  resetBtn: {
    flex: 1,
    alignItems: 'center',
  },
});

const mapStateToProps = ({ entries }, { route }) => ({
  entryId: route.params.entryId,
  metrics: entries[route.params.entryId],
});

export default connect(mapStateToProps)(EntryDetails);
