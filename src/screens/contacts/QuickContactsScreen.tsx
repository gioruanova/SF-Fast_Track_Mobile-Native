import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BackToHomeButton from '../../components/buttons/BackToHomeButton';
import PageTitle from '../../components/header/PageTitle';
import QuickContacts from '../../components/ui/QuickContacts';
import { COLORS } from '../../constants/theme';

export default function QuickContactsScreen() {
  return (
    <ScrollView style={styles.container}>
      <PageTitle>Contactos Rápidos</PageTitle>
      <QuickContacts />
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
});

