import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DateHeader from './DateHeader';
import { getMetricMetaInfo } from '../utils/helpers';
import { gray } from '../utils/colors';

function MetricCard(props) {
  const { date, metrics } = props;

  return (
    <View>
      {date && <DateHeader date={date} />}
      {Object.keys(metrics).map((metric) => {
        const { getIcon, displayName, unit, backgroundColor } =
          getMetricMetaInfo(metric);

        return (
          <View style={styles.metric} key={metric}>
            {getIcon()}
            <View>
              <Text style={{ fontSize: 20 }}>{displayName}</Text>
              <Text style={{ fontSize: 16, color: gray }}>
                {metrics[metric]} {unit}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  metric: {
    flexDirection: 'row',
    marginTop: 12,
  },
});

export default MetricCard;
