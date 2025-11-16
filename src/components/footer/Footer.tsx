import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Fast Track</Text>
      <Text style={styles.footerText}>Todos los derechos reservados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  footerText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
});
  