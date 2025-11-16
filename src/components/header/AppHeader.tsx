import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import MenuButton from '../buttons/MenuButton';
import Icons from '../ui/Icons';

interface AppHeaderProps {
  navigation: DrawerNavigationProp<any>;
}

export default function AppHeader({ navigation }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.homeButton}
        activeOpacity={0.7}
      >
        <Icons.Home size={20} color={COLORS.white} />
        <Text style={styles.homeButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>

      <MenuButton onPress={() => navigation.toggleDrawer()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

