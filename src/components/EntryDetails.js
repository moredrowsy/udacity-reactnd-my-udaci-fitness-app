import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import { formatDate } from '../utils/helpers';
import MetricCard from './MetricCard';

function EntryDetails({ navigation, entryId, metrics }) {
  const date = formatDate(new Date(entryId));

  useLayoutEffect(() => {
    navigation.setOptions({ title: date });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MetricCard date={date} metrics={metrics} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
});

const mapStateToProps = ({ entries }, { route }) => ({
  entryId: route.params.entryId,
  metrics: entries[route.params.entryId],
});

export default connect(mapStateToProps)(EntryDetails);
