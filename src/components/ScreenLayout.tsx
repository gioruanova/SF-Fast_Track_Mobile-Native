import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';
import Footer from './Footer';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenLayout({ children, style }: ScreenLayoutProps) {
  return (
    <ScrollView 
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        {children}
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
});

