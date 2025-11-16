import { useEffect, useState } from 'react';
import { authService, UpdateProfileData, UserProfile } from '../services/auth.service';

interface ProfileFormData {
  user_complete_name: string;
  user_dni: string;
  user_phone: string;
  user_email: string;
  user_password: string;
  user_password_confirm: string;
}

interface ProfileFormErrors {
  user_complete_name?: string;
  user_dni?: string;
  user_phone?: string;
  user_email?: string;
  user_password?: string;
  user_password_confirm?: string;
}

export function useProfileForm(initialProfile: UserProfile | null) {
  const [formData, setFormData] = useState<ProfileFormData>({
    user_complete_name: initialProfile?.user_name || '',
    user_dni: initialProfile?.user_dni || '',
    user_phone: initialProfile?.user_phone || '',
    user_email: initialProfile?.user_email || '',
    user_password: '',
    user_password_confirm: '',
  });

  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        user_complete_name: initialProfile.user_name || '',
        user_dni: initialProfile.user_dni || '',
        user_phone: initialProfile.user_phone || '',
        user_email: initialProfile.user_email || '',
        user_password: '',
        user_password_confirm: '',
      });
    }
  }, [initialProfile]);

  const validateField = (name: keyof ProfileFormData, value: string): string | undefined => {
    switch (name) {
      case 'user_email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Email inválido';
        }
        break;
      case 'user_dni':
        if (value && !/^\d+$/.test(value)) {
          return 'DNI debe contener solo números';
        }
        break;
      case 'user_phone':
        if (value && !/^\d+$/.test(value)) {
          return 'Teléfono debe contener solo números';
        }
        break;
      case 'user_password':
        if (value && value.length < 6) {
          return 'La contraseña debe tener al menos 6 caracteres';
        }
        break;
      case 'user_password_confirm':
        if (value && value !== formData.user_password) {
          return 'Las contraseñas no coinciden';
        }
        break;
    }
    return undefined;
  };

  const updateField = (name: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));

    if (name === 'user_password' && formData.user_password_confirm) {
      const confirmError = validateField('user_password_confirm', formData.user_password_confirm);
      setErrors(prev => ({
        ...prev,
        user_password_confirm: confirmError,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof ProfileFormData;
      const value = formData[fieldName];
      const error = validateField(fieldName, value);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const hasChanges = (): boolean => {
    const hasNameChange = formData.user_complete_name !== (initialProfile?.user_name || '');
    const hasDniChange = formData.user_dni !== (initialProfile?.user_dni || '');
    const hasPhoneChange = formData.user_phone !== (initialProfile?.user_phone || '');
    const hasEmailChange = formData.user_email !== (initialProfile?.user_email || '');
    const hasPasswordChange = formData.user_password.length > 0;

    return hasNameChange || hasDniChange || hasPhoneChange || hasEmailChange || hasPasswordChange;
  };

  const buildUpdateData = (): UpdateProfileData => {
    const updateData: UpdateProfileData = {};

    if (formData.user_complete_name && formData.user_complete_name !== initialProfile?.user_name) {
      updateData.user_complete_name = formData.user_complete_name;
    }

    if (formData.user_dni && formData.user_dni !== initialProfile?.user_dni) {
      updateData.user_dni = formData.user_dni;
    }

    if (formData.user_phone && formData.user_phone !== initialProfile?.user_phone) {
      updateData.user_phone = formData.user_phone;
    }

    if (formData.user_email && formData.user_email !== initialProfile?.user_email) {
      updateData.user_email = formData.user_email;
    }

    if (formData.user_password) {
      updateData.user_password = formData.user_password;
    }

    return updateData;
  };

  const submitForm = async (): Promise<{ 
    success: boolean; 
    error?: string;
    requiresReauth?: boolean;
  }> => {
    if (!validateForm()) {
      return { success: false, error: 'Por favor corrige los errores del formulario' };
    }

    if (!hasChanges()) {
      return { success: false, error: 'No hay cambios para guardar' };
    }

    setIsSubmitting(true);

    try {
      const updateData = buildUpdateData();
      const hasEmailChange = updateData.user_email !== undefined;
      const hasPasswordChange = updateData.user_password !== undefined;
      const requiresReauth = hasEmailChange || hasPasswordChange;

      const response = await authService.updateProfile(updateData);

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          user_password: '',
          user_password_confirm: '',
        }));
        return { 
          success: true,
          requiresReauth,
        };
      }

      return { 
        success: false, 
        error: response.error || 'Error al actualizar el perfil' 
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    hasChanges: hasChanges(),
  };
}

