import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MenuButton from '../components/buttons/MenuButton';
import CustomDrawerContent from '../components/drawer/CustomDrawerContent';
import Icons from '../components/ui/Icons';
import { COLORS } from '../constants/theme';
import { getDrawerScreenOptions } from './drawerConfig';
import { drawerRoutes } from './routes.config';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        ...getDrawerScreenOptions(),
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.homeButton}
            activeOpacity={0.7}
          >
            <Icons.Home size={20} color={COLORS.white} />
            <Text style={styles.homeButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.menuButtonContainer}>
            <MenuButton onPress={() => navigation.toggleDrawer()} />
          </View>
        ),
      })}
    >
      {drawerRoutes.map((route) => (
        <Drawer.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{ title: route.title }}
        />
      ))}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingVertical: 8,
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  menuButtonContainer: {
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

