import Icons from '../components/ui/Icons';
import ClaimDetailScreen from '../screens/claims/ClaimDetailScreen';
import ClosedClaimsScreen from '../screens/claims/ClosedClaimsScreen';
import OpenClaimsScreen from '../screens/claims/OpenClaimsScreen';
import QuickContactsScreen from '../screens/contacts/QuickContactsScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import FeedbackScreen from '../screens/feedback/FeedbackScreen';
import MensajesScreen from '../screens/messages/MensajesScreen';
import ProfileSettingsScreen from '../screens/profile/ProfileSettingsScreen';

export type IconName = keyof typeof Icons;

export interface RouteConfig {
  name: string;
  component: React.ComponentType<any>;
  title: string;
  icon: IconName;
}

export const drawerRoutes: RouteConfig[] = [
  {
    name: 'Dashboard',
    component: DashboardScreen,
    title: 'Inicio',
    icon: 'Home',
  },
  {
    name: 'OpenClaims',
    component: OpenClaimsScreen,
    title: 'Reclamos Abiertos',
    icon: 'FileText',
  },
  {
    name: 'ClosedClaims',
    component: ClosedClaimsScreen,
    title: 'Reclamos Cerrados',
    icon: 'CheckCircle',
  },
  {
    name: 'ClaimDetail',
    component: ClaimDetailScreen,
    title: 'Detalle del Reclamo',
    icon: 'FileText',
  },
  {
    name: 'QuickContacts',
    component: QuickContactsScreen,
    title: 'Contactos Rápidos',
    icon: 'Phone',
  },
  {
    name: 'Mensajes',
    component: MensajesScreen,
    title: 'Mensajes',
    icon: 'MessageCircle',
  },
  {
    name: 'Feedback',
    component: FeedbackScreen,
    title: 'Feedback',
    icon: 'MessageCirclePlus',
  },
  {
    name: 'ProfileSettings',
    component: ProfileSettingsScreen,
    title: 'Configuración de Perfil',
    icon: 'SettingsIcon',
  },
];

