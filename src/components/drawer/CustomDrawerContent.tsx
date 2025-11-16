import { DrawerContentComponentProps, DrawerContentScrollView, } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { drawerRoutes } from '../../navigation/routes.config';
import DrawerFooter from './DrawerFooter';
import DrawerHeader from './DrawerHeader';
import DrawerMenuItem from './DrawerMenuItem';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuth();
  const { navigation, state } = props;

  const menuItems = drawerRoutes.filter(
    route => route.name !== 'ProfileSettings' && route.name !== 'ClaimDetail'
  );
  const currentRoute = state.routes[state.index].name;

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        <DrawerHeader
          userName={user?.user_name}
          userEmail={user?.user_email}
          onClose={() => navigation.closeDrawer()}
        />

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <DrawerMenuItem
              key={item.name}
              icon={item.icon}
              label={item.title}
              isActive={currentRoute === item.name}
              onPress={() => navigation.navigate(item.name)}
            />
          ))}
        </View>
      </DrawerContentScrollView>

      <DrawerFooter
        onSettingsPress={() => navigation.navigate('ProfileSettings')}
        onLogoutPress={logout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  menuSection: {
    paddingTop: 12,
  },
});

