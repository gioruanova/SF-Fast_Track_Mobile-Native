import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import Icons from '../ui/Icons';
import type { Message } from '../../types/message';

interface MessageCardProps {
  message: Message;
  onPress: (message: Message) => void;
}

export default function MessageCard({ message, onPress }: MessageCardProps) {
  const isUnread = message.is_read === 0;
  const { platformMessage } = message;

  const cleanContent = platformMessage.platform_message_content
    .replace(/<[^>]*>/g, '')
    .substring(0, 150);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isUnread && styles.cardUnread]}
      onPress={() => onPress(message)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icons.Mail size={20} color={isUnread ? COLORS.primary : COLORS.gray} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.sender, isUnread && styles.textUnread]}>
            {platformMessage.message_sender}
          </Text>
          <Text style={styles.date}>{formatDate(message.created_at)}</Text>
        </View>
        {isUnread && <View style={styles.badge} />}
      </View>

      <Text style={[styles.title, isUnread && styles.textUnread]} numberOfLines={1}>
        {platformMessage.platform_message_title}
      </Text>

      <Text style={styles.content} numberOfLines={2}>
        {cleanContent}...
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardUnread: {
    backgroundColor: '#F0F8FF',
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  sender: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 6,
  },
  textUnread: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  content: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

