import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import PageTitle from '../header/PageTitle';

interface BasicScreenProps {
  title: string;
}

export default function BasicScreen({ title }: BasicScreenProps) {
  return (
    <View style={styles.container}>
      <PageTitle>{title}</PageTitle>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.white,
  },
});

