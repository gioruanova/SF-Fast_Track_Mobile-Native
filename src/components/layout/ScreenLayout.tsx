import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/theme';
import Footer from '../footer/Footer';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

export default function ScreenLayout({ children, style, scrollable = true }: ScreenLayoutProps) {
  if (!scrollable) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.content}>
          {children}
        </View>
        <Footer />
      </View>
    );
  }

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

