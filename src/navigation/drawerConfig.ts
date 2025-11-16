import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { COLORS } from '../constants/theme';

export const getDrawerScreenOptions = (): DrawerNavigationOptions => ({
  headerStyle: {
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitle: '',
  drawerPosition: 'left',
  drawerType: 'front',
  swipeEnabled: true,
  swipeEdgeWidth: 50,
});

