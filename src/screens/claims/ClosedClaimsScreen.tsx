import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import BackToHomeButton from '../../components/buttons/BackToHomeButton';
import ClaimsList from '../../components/cards/ClaimsList';
import PageHeader from '../../components/header/PageHeader';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { useClaims } from '../../hooks/useClaims';
import { Claim } from '../../services/claims.service';
import { RootDrawerParamList } from '../../types/navigation';

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
    <ScreenLayout>
      <PageHeader 
        title="Reclamos Cerrados" 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
        disabled={isLoading}
      />
      
      <ClaimsList
        claims={claims}
        isLoading={isLoading}
        error={error}
        emptyMessage="No hay reclamos cerrados"
        onClaimPress={handleClaimPress}
      />
      
      <BackToHomeButton />
    </ScreenLayout>
  );
}

