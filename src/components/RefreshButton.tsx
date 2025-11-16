import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  disabled?: boolean;
}

export default function RefreshButton({ onRefresh, isRefreshing, disabled = false }: RefreshButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.refreshButton} 
      onPress={onRefresh}
      disabled={isRefreshing || disabled}
    >
      {isRefreshing ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Text style={styles.refreshIcon}>🔄</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 20,
  },
});

