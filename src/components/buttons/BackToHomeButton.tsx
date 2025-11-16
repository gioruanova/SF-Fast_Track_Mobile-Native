import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';
import type { IconName } from '../../navigation/routes.config';
import type { RootDrawerParamList } from '../../types/navigation';
import Icons from '../ui/Icons';

type DrawerScreenName = keyof RootDrawerParamList;
type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const DRAWER_CLOSE_DELAY = 150;

const navigateToScreen = (
  navigation: NavigationProp,
  screenName: DrawerScreenName
): void => {
  switch (screenName) {
    case 'Dashboard':
      navigation.navigate('Dashboard');
      break;
    case 'OpenClaims':
      navigation.navigate('OpenClaims');
      break;
    case 'ClosedClaims':
      navigation.navigate('ClosedClaims');
      break;
    case 'QuickContacts':
      navigation.navigate('QuickContacts');
      break;
    case 'Mensajes':
      navigation.navigate('Mensajes');
      break;
    case 'Feedback':
      navigation.navigate('Feedback');
      break;
    case 'ProfileSettings':
      navigation.navigate('ProfileSettings');
      break;
    default:
      navigation.navigate('Dashboard');
  }
};

interface BackToHomeButtonProps {
  destination?: DrawerScreenName;
  text?: string;
  iconName?: IconName;
  iconSize?: number;
  iconColor?: string;
}

export default function BackToHomeButton({
  destination = 'Dashboard',
  text = 'Volver al Inicio',
  iconName = 'Home',
  iconSize = 20,
  iconColor = COLORS.white,
}: BackToHomeButtonProps) {
  const navigation = useNavigation<NavigationProp>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    navigation.dispatch(DrawerActions.closeDrawer());

    timeoutRef.current = setTimeout(() => {
      navigateToScreen(navigation, destination);
      timeoutRef.current = null;
    }, DRAWER_CLOSE_DELAY);
  }, [destination, navigation]);

  const IconComponent = Icons[iconName];

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <IconComponent size={iconSize} color={iconColor} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

