import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackToHomeButton from '../components/BackToHomeButton';
import PageTitle from '../components/PageTitle';
import ScreenLayout from '../components/ScreenLayout';
import { COLORS } from '../constants/theme';
import { sendFeedback } from '../services/feedback.service';

export default function FeedbackScreen() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Por favor ingrese un mensaje');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendFeedback(message.trim());

      if (response.success) {
        Alert.alert('Éxito', 'Feedback enviado correctamente', [
          {
            text: 'OK',
            onPress: () => setMessage(''),
          },
        ]);
      } else {
        Alert.alert('Error', response.error || 'No se pudo enviar el feedback');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al enviar el feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout>
      <PageTitle>Feedback</PageTitle>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Tu mensaje</Text>
        <TextInput
          style={styles.textArea}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe aquí tu feedback, sugerencia o comentario..."
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          editable={!isSubmitting}
        />

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>

      <BackToHomeButton />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
    minHeight: 150,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
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

