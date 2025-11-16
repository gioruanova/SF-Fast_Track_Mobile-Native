import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useCompany } from '../../contexts/CompanyContext';
import Icons from './Icons';

export default function QuickContacts() {
  const { companyInfo, isLoading, error } = useCompany();

  const handleCall = () => {
    if (companyInfo?.company_phone) {
      Linking.openURL(`tel:${companyInfo.company_phone}`);
    }
  };

  const handleEmail = () => {
    if (companyInfo?.company_email) {
      Linking.openURL(`mailto:${companyInfo.company_email}`);
    }
  };

  const handleWhatsApp = () => {
    if (companyInfo?.company_whatsapp) {
      const phone = companyInfo.company_whatsapp.replace(/[^0-9]/g, '');
      Linking.openURL(`whatsapp://send?phone=${phone}`).catch(() => {
        Alert.alert('Error', 'WhatsApp no está instalado en este dispositivo');
      });
    }
  };

  const handleTelegram = () => {
    if (companyInfo?.company_telegram) {
      const phone = companyInfo.company_telegram.replace(/[^0-9]/g, '');
      Linking.openURL(`tg://resolve?phone=${phone}`).catch(() => {
        Alert.alert('Error', 'Telegram no está instalado en este dispositivo');
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando contactos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contactos Rápidos</Text>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!companyInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contactos Rápidos</Text>
        <Text style={styles.loading}>No hay información disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.info}>Ponete en contacto con tu organizacion ante cualquier duda o problema</Text>
      <View style={styles.buttonsGrid}>
        {companyInfo.company_phone && (
          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <View style={styles.buttonContent}>
              <Icons.Phone size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Llamar</Text>
            </View>
          </TouchableOpacity>
        )}

        {companyInfo.company_email && (
          <TouchableOpacity style={styles.button} onPress={handleEmail}>
            <View style={styles.buttonContent}>
              <Icons.Mail size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Email</Text>
            </View>
          </TouchableOpacity>
        )}

        {companyInfo.company_whatsapp && (
          <TouchableOpacity style={styles.button} onPress={handleWhatsApp}>
            <View style={styles.buttonContent}>
              <Icons.MessageCircle size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>WhatsApp</Text>
            </View>
          </TouchableOpacity>
        )}

        {companyInfo.company_telegram && (
          <TouchableOpacity style={styles.button} onPress={handleTelegram}>
            <View style={styles.buttonContent}>
              <Icons.Send size={24} color={COLORS.white} />
              <Text style={styles.buttonText}>Telegram</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    paddingVertical: 2,
    marginBottom: 12,
  },
  loading: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  error: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    lineHeight: 36,
    marginBottom: 4,
  },
  buttonText: {
    marginTop: 4,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});

