import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackToHomeButton from '../components/BackToHomeButton';
import ClaimsList from '../components/ClaimsList';
import PageTitle from '../components/PageTitle';
import { COLORS } from '../constants/theme';
import { useClaims } from '../hooks/useClaims';
import { Claim } from '../services/claims.service';
import { RootDrawerParamList } from '../types/navigation';

type ClosedClaimsScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'ClosedClaims'>;

export default function ClosedClaimsScreen() {
  const navigation = useNavigation<ClosedClaimsScreenNavigationProp>();
  const { claims, isLoading, error, refetch } = useClaims({ filter: 'closed' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleClaimPress = (claim: Claim) => {
    navigation.navigate('ClaimDetail', { reclamoId: claim.reclamo_id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <PageTitle style={styles.titleInHeader}>Reclamos Cerrados</PageTitle>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.refreshIcon}>🔄</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ClaimsList
        claims={claims}
        isLoading={isLoading}
        error={error}
        emptyMessage="No hay reclamos cerrados"
        onClaimPress={handleClaimPress}
      />
      
      <BackToHomeButton />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.white,
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
});

