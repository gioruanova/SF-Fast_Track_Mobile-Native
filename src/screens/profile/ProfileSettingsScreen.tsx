import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackToHomeButton from '../../components/buttons/BackToHomeButton';
import FormInput from '../../components/forms/FormInput';
import PageHeader from '../../components/header/PageHeader';
import ScreenLayout from '../../components/layout/ScreenLayout';
import LogoutCountdown from '../../components/modals/LogoutCountdown';
import Icons from '../../components/ui/Icons';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileForm } from '../../hooks/useProfileForm';

export default function ProfileSettingsScreen() {
  const { user, refreshProfile, logout } = useAuth();
  const { formData, errors, isSubmitting, updateField, submitForm, hasChanges } = useProfileForm(user);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showLogoutCountdown, setShowLogoutCountdown] = useState(false);

  const handleSubmit = async () => {
    const result = await submitForm();

    if (result.success) {
      if (result.requiresReauth) {
        setShowLogoutCountdown(true);
      } else {
        await refreshProfile();
        Alert.alert(
          'Éxito',
          'Tu perfil se actualizó correctamente',
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert(
        'Error',
        result.error || 'No se pudo actualizar el perfil',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLogoutComplete = async () => {
    await logout();
  };

  return (
    <ScreenLayout scrollable={true}>
      <PageHeader title="Configuración de Perfil" />

      <View style={styles.infoBox}>
        <Icons.User size={20} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Actualiza tu información personal. Los campos vacíos no se actualizarán.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <FormInput
          label="Nombre Completo"
          value={formData.user_complete_name}
          onChangeText={(text) => updateField('user_complete_name', text)}
          error={errors.user_complete_name}
          placeholder="Ingresa tu nombre completo"
          autoCapitalize="words"
        />

        <FormInput
          label="DNI"
          value={formData.user_dni}
          onChangeText={(text) => updateField('user_dni', text)}
          error={errors.user_dni}
          placeholder="Ingresa tu DNI"
          keyboardType="numeric"
        />

        <FormInput
          label="Teléfono"
          value={formData.user_phone}
          onChangeText={(text) => updateField('user_phone', text)}
          error={errors.user_phone}
          placeholder="Ingresa tu teléfono"
          keyboardType="phone-pad"
        />

        <FormInput
          label="Email"
          value={formData.user_email}
          onChangeText={(text) => updateField('user_email', text)}
          error={errors.user_email}
          placeholder="Ingresa tu email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
        <Text style={styles.sectionSubtitle}>
          Deja estos campos vacíos si no deseas cambiar tu contraseña
        </Text>

        <View style={styles.passwordContainer}>
          <FormInput
            label="Nueva Contraseña"
            value={formData.user_password}
            onChangeText={(text) => updateField('user_password', text)}
            error={errors.user_password}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Icons.EyeOff size={20} color={COLORS.gray} />
            ) : (
              <Icons.EyeIcon size={20} color={COLORS.gray} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <FormInput
            label="Confirmar Contraseña"
            value={formData.user_password_confirm}
            onChangeText={(text) => updateField('user_password_confirm', text)}
            error={errors.user_password_confirm}
            placeholder="Confirmar la contraseña"
            secureTextEntry={!showPasswordConfirm}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            {showPasswordConfirm ? (
              <Icons.EyeOff size={20} color={COLORS.gray} />
            ) : (
              <Icons.EyeIcon size={20} color={COLORS.gray} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (!hasChanges || isSubmitting) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!hasChanges || isSubmitting}
      >
        {isSubmitting ? (
          <Text style={styles.submitButtonText}>Guardando...</Text>
        ) : (
          <>
            <Icons.CheckCircle size={20} color={COLORS.white} />
            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
          </>
        )}
      </TouchableOpacity>

      {!hasChanges && (
        <Text style={styles.noChangesText}>
          No hay cambios para guardar
        </Text>
      )}

      <BackToHomeButton />

      <LogoutCountdown
        visible={showLogoutCountdown}
        onComplete={handleLogoutComplete}
        seconds={5}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 30,
    padding: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  noChangesText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
});

