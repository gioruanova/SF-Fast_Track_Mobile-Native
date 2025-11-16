import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WorkloadToggle from '../../components/buttons/WorkloadToggle';
import ClaimsList from '../../components/cards/ClaimsList';
import PageHeader from '../../components/header/PageHeader';
import PageTitle from '../../components/header/PageTitle';
import ScreenLayout from '../../components/layout/ScreenLayout';
import QuickContacts from '../../components/ui/QuickContacts';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useClaims } from '../../hooks/useClaims';
import { Claim } from '../../services/claims.service';
import { RootDrawerParamList } from '../../types/navigation';

type DashboardScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const openClaims = useClaims({ filter: 'open' });
  const closedClaims = useClaims({ filter: 'closed' });

  const [isRefreshingOpen, setIsRefreshingOpen] = useState(false);
  const [isRefreshingClosed, setIsRefreshingClosed] = useState(false);

  const openClaimsToShow = openClaims.claims.slice(0, 5);
  const closedClaimsToShow = closedClaims.claims.slice(0, 5);
  const hasMoreOpenClaims = openClaims.claims.length > 5;
  const hasMoreClosedClaims = closedClaims.claims.length > 5;

  const handleClaimPress = (claim: Claim) => {
    navigation.navigate('ClaimDetail', { reclamoId: claim.reclamo_id });
  };

  const handleRefreshOpen = async () => {
    setIsRefreshingOpen(true);
    await openClaims.refetch();
    setIsRefreshingOpen(false);
  };

  const handleRefreshClosed = async () => {
    setIsRefreshingClosed(true);
    await closedClaims.refetch();
    setIsRefreshingClosed(false);
  };

  return user?.company_status !== 1 ? (
    <ScreenLayout>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contacte a su administrador</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScreenLayout>
  ) : (
    <ScreenLayout>
      <View style={styles.sectionContainer}>
        <Text style={styles.welcomeText}>Bienvenido/a {user?.user_name}</Text>
        <Text style={styles.label}>Empresa: {user?.company_name}</Text>
        <Text style={styles.label}>Estado Suscripcion: {user?.company_status === 1 ? 'ACTIVA' : 'INACTIVA'.toUpperCase()}</Text>
      </View>

      <WorkloadToggle />

      <View style={styles.sectionContainer}>
        <PageTitle>Contactos Rápidos</PageTitle>
        <QuickContacts />
      </View>

      <View style={styles.sectionContainer}>
        <PageHeader
          title="Reclamos Abiertos (Últimos 5)"
          onRefresh={handleRefreshOpen}
          isRefreshing={isRefreshingOpen}
          disabled={openClaims.isLoading}
        />
        <ClaimsList
          claims={openClaimsToShow}
          isLoading={openClaims.isLoading}
          error={openClaims.error}
          emptyMessage="No hay reclamos abiertos"
          onClaimPress={handleClaimPress}
          showViewMore={hasMoreOpenClaims}
          onViewMore={() => navigation.navigate('OpenClaims')}
        />
      </View>

      <View style={styles.sectionContainer}>
        <PageHeader
          title="Reclamos Cerrados (Últimos 5)"
          onRefresh={handleRefreshClosed}
          isRefreshing={isRefreshingClosed}
          disabled={closedClaims.isLoading}
        />
        <ClaimsList
          claims={closedClaimsToShow}
          isLoading={closedClaims.isLoading}
          error={closedClaims.error}
          emptyMessage="No hay reclamos cerrados"
          onClaimPress={handleClaimPress}
          showViewMore={hasMoreClosedClaims}
          onViewMore={() => navigation.navigate('ClosedClaims')}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: COLORS.white,
    gap: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.black,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  logoutButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

