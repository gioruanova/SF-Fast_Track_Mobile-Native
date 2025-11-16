import React from 'react';
import { StyleSheet, View } from 'react-native';
import PageTitle from './PageTitle';
import RefreshButton from './RefreshButton';

interface PageHeaderProps {
  title: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  disabled?: boolean;
}

export default function PageHeader({ title, onRefresh, isRefreshing = false, disabled = false }: PageHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <PageTitle style={styles.title}>{title}</PageTitle>
      {onRefresh && (
        <RefreshButton 
          onRefresh={onRefresh} 
          isRefreshing={isRefreshing} 
          disabled={disabled} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    flex: 1,
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
});

