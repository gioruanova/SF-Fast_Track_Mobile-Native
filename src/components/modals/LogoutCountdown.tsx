import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import Icons from '../ui/Icons';

interface LogoutCountdownProps {
  visible: boolean;
  onComplete: () => void;
  seconds?: number;
}

export default function LogoutCountdown({ 
  visible, 
  onComplete, 
  seconds = 5 
}: LogoutCountdownProps) {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    if (!visible) {
      setCountdown(seconds);
      return;
    }

    if (countdown === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [visible, countdown, onComplete, seconds]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icons.LogOutIcon size={48} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Cerrando sesión</Text>
          
          <Text style={styles.message}>
            Tu sesión se cerrará para que vuelvas a iniciar sesión con tus credenciales nuevas
          </Text>

          <View style={styles.countdownContainer}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <Text style={styles.countdownLabel}>segundos</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
  },
  countdownLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
});

