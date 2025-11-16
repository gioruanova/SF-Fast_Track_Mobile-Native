import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ClaimsList from '../components/ClaimsList';
import PageTitle from '../components/PageTitle';
import QuickContacts from '../components/QuickContacts';
import WorkloadToggle from '../components/WorkloadToggle';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useClaims } from '../hooks/useClaims';
import { Claim } from '../services/claims.service';
import { RootDrawerParamList } from '../types/navigation';

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

  return (
    <View style={styles.container}>
      {user?.company_status !== 1 ? (
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contacte a su administrador</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.sectionContainer}>
            <Text style={styles.welcomeText}>Bienvenido/a {user?.user_name}</Text>
          </View>

          <WorkloadToggle />

          <View style={styles.sectionContainer}>
            <PageTitle>Contactos Rápidos</PageTitle>
            <QuickContacts />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <PageTitle style={styles.titleInHeader}>Reclamos Abiertos (Últimos 5)</PageTitle>
              <TouchableOpacity 
                style={styles.refreshButton} 
                onPress={handleRefreshOpen}
                disabled={isRefreshingOpen || openClaims.isLoading}
              >
                {isRefreshingOpen ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.refreshIcon}>🔄</Text>
                )}
              </TouchableOpacity>
            </View>
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
            <View style={styles.headerContainer}>
              <PageTitle style={styles.titleInHeader}>Reclamos Cerrados (Últimos 5)</PageTitle>
              <TouchableOpacity 
                style={styles.refreshButton} 
                onPress={handleRefreshClosed}
                disabled={isRefreshingClosed || closedClaims.isLoading}
              >
                {isRefreshingClosed ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.refreshIcon}>🔄</Text>
                )}
              </TouchableOpacity>
            </View>
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
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  titleInHeader: {
    flex: 1,
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  content: {
    flex: 1,
    padding: 24,
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

