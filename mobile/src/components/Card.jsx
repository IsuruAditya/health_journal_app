import React from 'react';
import { View } from 'react-native';

export default function Card({ children }) {
  return (
    <View style={{ padding: 16, margin: 8, backgroundColor: '#f5f5f5' }}>
      {children}
    </View>
  );
}