import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { COLORS } from '../../constants/theme';

interface PageTitleProps {
  children: string;
  style?: TextStyle;
}

export default function PageTitle({ children, style }: PageTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
    paddingBottom: 16,
  },
});

