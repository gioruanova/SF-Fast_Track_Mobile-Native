import React from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useWorkload } from '../../hooks/useWorkload';

export default function WorkloadToggle() {
  const { enabled, isLoading, error, toggle } = useWorkload();

  if (enabled === null || enabled === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando estado...</Text>
      </View>
    );
  }

  const isEnabled = Boolean(enabled);

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, isEnabled ? styles.labelEnabled : styles.labelDisabled]}>
            {isEnabled ? 'Recibiendo gestiones' : 'No recibiendo gestiones'}
          </Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <Switch
          value={isEnabled}
          onValueChange={toggle}
          disabled={isLoading}
          trackColor={{
            false: COLORS.danger,
            true: COLORS.success,
          }}
          thumbColor={COLORS.primary}
          ios_backgroundColor={COLORS.danger}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelEnabled: {
    color: COLORS.success,
  },
  labelDisabled: {
    color: COLORS.danger,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

