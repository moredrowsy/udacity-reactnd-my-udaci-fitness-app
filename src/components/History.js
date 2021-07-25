import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import AppLoading from 'expo-app-loading';
import UdaciFitnessCalendar from 'udacifitness-calendar';
import { receiveEntries, addEntry } from '../store/actions/entries.action';

import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalenderResults } from '../utils/api';
import { white } from '../utils/colors';

import DateHeader from './DateHeader';
import MetricCard from './MetricCard';

export function History(props) {
  const { dispatch, entries } = props;
  const [isReady, setIsReady] = useState(false);

  const fetchHistory = useCallback(async () => {
    const fetchedEntries = await fetchCalenderResults();
    const results = dispatch(receiveEntries(fetchedEntries));
    const { entries: dispatchedEntries } = results;
    if (!dispatchedEntries[timeToString()]) {
      dispatch(
        addEntry({
          [timeToString()]: getDailyReminderValue(),
        })
      );
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const renderItem = ({ today, ...metrics }, formattedDate, key) => (
    <View style={styles.item}>
      {today ? (
        <View>
          <DateHeader date={formattedDate} />
          <Text style={styles.noDataText}>{today}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => console.log('Pressed!')}>
          <MetricCard date={formattedDate} metrics={metrics} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyDate = (formattedDate) => (
    <View style={styles.item}>
      <DateHeader date={formattedDate} />
      <Text style={styles.noDataText}>You didn't log data on this day</Text>
    </View>
  );

  if (isReady) {
    return (
      <UdaciFitnessCalendar
        style={{ flex: 1 }}
        items={entries}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
      />
    );
  } else {
    return <AppLoading />;
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: `rgba(0,0,0,0.24)`,
    shadowOffset: { width: 0, height: 3 },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

const mapStateToProps = ({ entries }) => ({
  entries,
});

export default connect(mapStateToProps)(History);
