import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';
import Icons from '../ui/Icons';

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
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Icons.Refresh size={20} color={COLORS.white} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 20,
  },
});

