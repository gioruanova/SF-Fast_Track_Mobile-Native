import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import Icons from '../ui/Icons';
import type { IconName } from '../../navigation/routes.config';

interface DrawerMenuItemProps {
  icon: IconName;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function DrawerMenuItem({ icon, label, isActive, onPress }: DrawerMenuItemProps) {
  const IconComponent = Icons[icon];
  const iconColor = isActive ? COLORS.primary : COLORS.black;

  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.menuItemActive]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <IconComponent size={20} color={iconColor} />
      </View>
      <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemActive: {
    backgroundColor: '#F5F0FF',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    marginRight: 16,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  menuLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

