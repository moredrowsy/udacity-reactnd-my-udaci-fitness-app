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
import { Agenda } from 'react-native-calendars';
import { receiveEntries, addEntry } from '../store/actions/entries.action';

import {
  formatDate,
  getDailyReminderValue,
  timeToString,
} from '../utils/helpers';
import { fetchCalenderResults } from '../utils/api';
import { purple, white } from '../utils/colors';

import DateHeader from './DateHeader';
import MetricCard from './MetricCard';

export function History(props) {
  const { dispatch, entries, navigation } = props;
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

  const renderItem = (item) => {
    const { entry, formattedDate, key } = item;
    const { today, ...metrics } = entry;
    return (
      <View style={styles.item} key={key}>
        {today ? (
          <View>
            <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>{today}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation.push('EntryDetails', {
                entryId: key,
              })
            }
          >
            <MetricCard date={formattedDate} metrics={metrics} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyDate = (date) => {
    const formattedDate = formatDate(date[0]);
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>You didn't log data on this day</Text>
      </View>
    );
  };

  if (isReady) {
    // ! udacifitness-calendar is oudated
    // react-native-calendars require diff prop data than udacifitness-calendar
    // Need to convert old udaci entries data for react-native-calendars'
    // Agenda component
    // TODO: overhaul the original entries data to avoid this
    const agendaEntries = {};
    for (const [key, value] of Object.entries(entries)) {
      if (value) {
        const entry = {
          entry: value,
          formattedDate: formatDate(new Date(key)),
          key: key,
        };
        agendaEntries[key] = [entry];
      } else agendaEntries[key] = [];
    }

    return (
      <Agenda
        items={agendaEntries}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        theme={{
          agendaTodayColor: purple,
          agendaKnobColor: purple,
          calendarBackground: white,
          selectedDayBackgroundColor: purple,
          selectedDayTextColor: white,
          todayTextColor: purple,
          dotColor: purple,
          monthTextColor: purple,
          indicatorColor: purple,
          // Remove side bar day
          'stylesheet.agenda.list': {
            day: {
              width: 0,
            },
          },
        }}
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
