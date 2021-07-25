import React from 'react';
import { Text } from 'react-native';
import { purple } from '../utils/colors';

export default function DateHeader(props) {
  const { date } = props;
  return <Text style={{ color: purple, fontSize: 25 }}>{date}</Text>;
}
