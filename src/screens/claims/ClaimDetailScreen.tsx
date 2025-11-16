import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackToHomeButton from '../../components/buttons/BackToHomeButton';
import PageHeader from '../../components/header/PageHeader';
import PageTitle from '../../components/header/PageTitle';
import ScreenLayout from '../../components/layout/ScreenLayout';
import Icons from '../../components/ui/Icons';
import QuickContacts from '../../components/ui/QuickContacts';
import { ALL_CLAIM_STATES } from '../../constants/claimStates';
import { COLORS } from '../../constants/theme';
import { Claim, getClaimDetail, updateClaim, UpdateClaimData } from '../../services/claims.service';
import { RootDrawerParamList } from '../../types/navigation';

type ClaimDetailScreenRouteProp = RouteProp<RootDrawerParamList, 'ClaimDetail'>;

export default function ClaimDetailScreen() {
  const route = useRoute<ClaimDetailScreenRouteProp>();
  const { reclamoId } = route.params;

  const [claim, setClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [notaCierre, setNotaCierre] = useState<string>('');
  const [presupuesto, setPresupuesto] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClaimDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getClaimDetail(reclamoId);

      if (response.success && response.data) {
        setClaim(response.data);
      } else {
        setError(response.error || 'Error al cargar el reclamo');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [reclamoId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchClaimDetail();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (reclamoId) {
      fetchClaimDetail();
    } else {
      setError('No se recibió ID del reclamo');
      setIsLoading(false);
    }
  }, [reclamoId, fetchClaimDetail]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando detalle del reclamo...</Text>
      </View>
    );
  }

  if (error || !claim) {
    return (
      <ScreenLayout>
        <PageTitle>Detalle del Reclamo</PageTitle>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Reclamo no encontrado'}</Text>
        </View>
        <BackToHomeButton destination="OpenClaims" text="Volver a Reclamos Abiertos" iconName="FileText" />
      </ScreenLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString?.slice(0, 5) || '';
  };

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return '$0';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const handleOpenMap = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${claim?.cliente_lat},${claim?.cliente_lng}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir el mapa en este dispositivo');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el mapa');
    }
  };

  const handleCallPhone = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede realizar la llamada en este dispositivo');
      }
    } catch {
      Alert.alert('Error', 'No se pudo realizar la llamada');
    }
  };

  const handleSendEmail = async (email: string) => {
    const url = `mailto:${email}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir el cliente de correo en este dispositivo');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el cliente de correo');
    }
  };

  const handleOpenUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir el enlace en este dispositivo');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el enlace');
    }
  };

  const handleSubmitGestion = async () => {
    if (!selectedEstado) {
      Alert.alert('Error', 'Debe seleccionar un estado');
      return;
    }

    if (!notaCierre.trim()) {
      Alert.alert('Error', 'Debe agregar un comentario');
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: UpdateClaimData = {
        reclamo_estado: selectedEstado as Claim['reclamo_estado'],
        reclamo_nota_cierre: notaCierre.trim(),
      };

      if (presupuesto.trim()) {
        const presupuestoNum = parseFloat(presupuesto);
        if (!isNaN(presupuestoNum)) {
          updateData.reclamo_presupuesto = presupuestoNum.toString();
        }
      }

      const response = await updateClaim(reclamoId, updateData);

      if (response.success) {
        setSelectedEstado('');
        setNotaCierre('');
        setPresupuesto('');
        
        await fetchClaimDetail();
        
        Alert.alert('Éxito', 'Reclamo actualizado correctamente');
      } else {
        Alert.alert('Error', response.error || 'No se pudo actualizar el reclamo');
      }
    } catch {
      Alert.alert('Error', 'Error al actualizar el reclamo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estadosDisponibles = ALL_CLAIM_STATES.filter(
    (estado) => estado !== claim?.reclamo_estado
  );

  return (
    <ScreenLayout>
      <PageHeader
        title={`Detalle del Reclamo #${claim.reclamo_id}`}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        disabled={isLoading}
      />

      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusBadge,
              claim.reclamo_estado !== 'CERRADO' && claim.reclamo_estado !== 'CANCELADO'
                ? styles.statusOpen
                : styles.statusClosed,
            ]}
          >
            {claim.reclamo_estado}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Información General</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>N°:</Text>
          <Text style={styles.value}>{claim.reclamo_id}</Text>
        </View>

        <View style={styles.sectionFlex}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Creado por:</Text>
            <Text style={styles.value}>{claim.creador}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha de creación:</Text>
            <Text style={styles.value}>{formatDate(claim.created_at)}</Text>
          </View>
        </View>

        <View style={styles.sectionFlex}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>
              {claim.agenda_fecha ? formatDate(claim.agenda_fecha) : 'No programada'}
            </Text>
          </View>
          {claim.agenda_hora_desde && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Horario:</Text>
              <Text style={styles.value}>
                {formatTime(claim.agenda_hora_desde)}
                {claim.agenda_hora_hasta && ` - ${formatTime(claim.agenda_hora_hasta)}`}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Especialidad:</Text>
          <Text style={styles.value}>{claim.nombre_especialidad}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Información del Cliente</Text>
        <View style={styles.section}>
          <View style={styles.sectionFlex}>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{claim.cliente_complete_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cliente ID:</Text>
              <Text style={styles.value}>{claim.cliente_dni}</Text>
            </View>
          </View>
          <View style={styles.sectionFlex}>
            <View style={styles.infoIcon}>
              <Icons.Phone size={20} color={COLORS.primary} />
              <TouchableOpacity onPress={() => handleCallPhone(claim.cliente_phone)}>
                <Text style={styles.label}>Telefono:</Text>
                <Text style={styles.valueActive}>{claim.cliente_phone}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoIcon}>
              <Icons.Mail size={20} color={COLORS.primary} />
              <TouchableOpacity onPress={() => handleSendEmail(claim.cliente_email)}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.valueActive}>{claim.cliente_email}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.value}>{claim.cliente_direccion}</Text>
          </View>




          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <Icons.MapPin size={20} color={COLORS.white} />
            <Text style={styles.mapButtonText}>Ver en el mapa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <PageTitle>Contactos Rápidos</PageTitle>
          <QuickContacts />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Descripción del Reclamo</Text>
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Título:</Text>
            <Text style={styles.value}>{claim.reclamo_titulo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Detalle:</Text>
            <Text style={styles.value}>{claim.reclamo_detalle}</Text>
          </View>
          {claim.reclamo_url && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Link:</Text>
              <View style={styles.infoIcon}>
                <TouchableOpacity onPress={() => handleOpenUrl(claim.reclamo_url!)}>
                  <Icons.ExternalLink size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.valueActive}>{claim.reclamo_url}</Text>
              </View>
            </View>
          )}
        </View>

        {claim.reclamo_estado !== 'CERRADO' && claim.reclamo_estado !== 'CANCELADO' && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gestión del Reclamo</Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Estado *</Text>
                <View style={styles.estadosContainer}>
                  {estadosDisponibles.map((estado) => (
                    <TouchableOpacity
                      key={estado}
                      style={[
                        styles.estadoButton,
                        selectedEstado === estado && styles.estadoButtonSelected,
                      ]}
                      onPress={() => setSelectedEstado(estado)}
                    >
                      <Text
                        style={[
                          styles.estadoButtonText,
                          selectedEstado === estado && styles.estadoButtonTextSelected,
                        ]}
                      >
                        {estado}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Comentario *</Text>
                <TextInput
                  style={styles.textArea}
                  value={notaCierre}
                  onChangeText={setNotaCierre}
                  placeholder="Ingrese un comentario sobre el cambio de estado"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Presupuesto (opcional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={presupuesto}
                  onChangeText={setPresupuesto}
                  placeholder="Ingrese el presupuesto"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmitGestion}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {(claim.reclamo_estado === 'CERRADO' || claim.reclamo_estado === 'CANCELADO') && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información de Cierre</Text>
              {claim.reclamo_nota_cierre && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Nota de cierre:</Text>
                  <Text style={styles.value}>{claim.reclamo_nota_cierre}</Text>
                </View>
              )}
              {claim.reclamo_presupuesto && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Presupuesto:</Text>
                  <Text style={styles.value}>{formatCurrency(claim.reclamo_presupuesto)}</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      {
        claim.reclamo_estado === 'CERRADO' || claim.reclamo_estado === 'CANCELADO' ? (
          <BackToHomeButton destination="ClosedClaims" text="Volver a Reclamos Cerrados" iconName="CheckCircle" />
        ) : (
          <BackToHomeButton destination="OpenClaims" text="Volver a Reclamos Abiertos" iconName="FileText" />
        )
      }
      <BackToHomeButton />
    </ScreenLayout >
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusOpen: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
  },
  statusClosed: {
    backgroundColor: '#999',
    color: COLORS.white,
  },
  sectionFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  infoIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: 2,
  },
  valueActive: {
    color: COLORS.primary,
  },
  value: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
  linkValue: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,

    marginTop: 12,
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  estadosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  estadoButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.white,
  },
  estadoButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  estadoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  estadoButtonTextSelected: {
    color: COLORS.white,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});

