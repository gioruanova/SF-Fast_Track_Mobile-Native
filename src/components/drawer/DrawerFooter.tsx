import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import Icons from '../ui/Icons';

interface DrawerFooterProps {
  onSettingsPress: () => void;
  onLogoutPress: () => void;
}

export default function DrawerFooter({ onSettingsPress, onLogoutPress }: DrawerFooterProps) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.settingsItem} onPress={onSettingsPress}>
        <Icons.SettingsIcon size={20} color={COLORS.black} />
        <Text style={styles.menuLabel}>Configuración de Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutItem} onPress={onLogoutPress}>
        <Icons.LogOutIcon size={20} color={COLORS.danger} />
        <Text style={styles.logoutLabel}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 20,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 4,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    gap: 20,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  logoutLabel: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: '600',
  },
});

