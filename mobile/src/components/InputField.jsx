import React from 'react';
import { TextInput } from 'react-native';

export default function InputField({ placeholder, value, onChangeText }) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
}