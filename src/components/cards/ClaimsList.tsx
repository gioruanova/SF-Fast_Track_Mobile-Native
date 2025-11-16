import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { Claim } from '../../services/claims.service';
import Icons from '../ui/Icons';

interface ClaimsListProps {
  claims: Claim[];
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
  onClaimPress?: (claim: Claim) => void;
  showViewMore?: boolean;
  onViewMore?: () => void;
}

export default function ClaimsList({
  claims,
  isLoading,
  error,
  emptyMessage = 'No hay reclamos',
  onClaimPress,
  showViewMore = false,
  onViewMore,
}: ClaimsListProps) {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando reclamos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (claims.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const formatCita = (claim: Claim) => {
    if (!claim.agenda_fecha) return 'No programada';

    const fecha = new Date(claim.agenda_fecha).toLocaleDateString('es-AR');
    const horaDesde = claim.agenda_hora_desde?.slice(0, 5) || '';
    const horaHasta = claim.agenda_hora_hasta?.slice(0, 5);

    if (horaHasta) {
      return `${fecha} ${horaDesde} - ${horaHasta}`;
    }
    return `${fecha} ${horaDesde}`;
  };

  const sortedClaims = [...claims].sort((a, b) => {
    if (!a.agenda_fecha && !b.agenda_fecha) return 0;
    if (!a.agenda_fecha) return 1;
    if (!b.agenda_fecha) return -1;

    const dateA = new Date(a.agenda_fecha).getTime();
    const dateB = new Date(b.agenda_fecha).getTime();

    return dateA - dateB;
  });

  return (
    <View style={styles.container}>
      {sortedClaims.map((claim) => {
        const isOpen = claim.reclamo_estado !== 'CERRADO' && claim.reclamo_estado !== 'CANCELADO';

        return (
          <View
            key={claim.reclamo_id}
            style={[
              styles.claimCard,
              isOpen ? styles.claimOpen : styles.claimClosed,
            ]}
          >
            <View style={styles.claimHeader}>
              <Text style={styles.claimNumber}>N°: {claim.reclamo_id}</Text>
              <Text style={styles.claimNumber}>{claim.reclamo_estado}</Text>
              {onClaimPress && (
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => onClaimPress(claim)}
                >
                  <View style={styles.viewButtonIcon}>
                    <Icons.EyeIcon size={20} color={COLORS.white} />
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.claimRow}>
              <Text style={styles.detailLabel}>Cliente:</Text>
              <Text style={styles.detailValue}>{claim.cliente_complete_name}</Text>
            </View>

            <View style={styles.claimRow}>
              <Text style={styles.detailLabel}>Cita:</Text>
              <Text style={styles.detailValue}>{formatCita(claim)}</Text>
            </View>
          </View>
        );
      })}

      {showViewMore && onViewMore && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
          <Text style={styles.viewMoreButtonText}>Ver más reclamos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 20
  },
  centerContainer: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  claimCard: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  claimOpen: {
    borderLeftColor: COLORS.success,
  },
  claimClosed: {
    borderLeftColor: '#999',
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  viewButtonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  claimNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  claimRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.black,
    flex: 1,
  },
  viewMoreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewMoreButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});


