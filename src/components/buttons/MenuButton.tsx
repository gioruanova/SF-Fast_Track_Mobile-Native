import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';
import Icons from '../ui/Icons';

interface MenuButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

export default function MenuButton({ 
  onPress, 
  color = COLORS.white, 
  size = 28 
}: MenuButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Icons.Menu size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});

