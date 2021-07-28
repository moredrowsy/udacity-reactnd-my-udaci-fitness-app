import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

function TextButton(props) {
  const { children, onPress, style } = props;
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={style}>{children}</Text>
    </TouchableOpacity>
  );
}

export default TextButton;
