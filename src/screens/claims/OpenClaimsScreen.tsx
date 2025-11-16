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

type OpenClaimsScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'OpenClaims'>;

export default function OpenClaimsScreen() {
  const navigation = useNavigation<OpenClaimsScreenNavigationProp>();
  const { claims, isLoading, error, refetch } = useClaims({ filter: 'open' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClaimPress = (claim: Claim) => {
    navigation.navigate('ClaimDetail', { reclamoId: claim.reclamo_id });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  
  return (
    <ScreenLayout>
      <PageHeader 
        title="Reclamos Abiertos" 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
        disabled={isLoading}
      />
      
      <ClaimsList
        claims={claims}
        isLoading={isLoading}
        error={error}
        emptyMessage="No hay reclamos abiertos"
        onClaimPress={handleClaimPress}
      />
      
      <BackToHomeButton />
    </ScreenLayout>
  );
}


