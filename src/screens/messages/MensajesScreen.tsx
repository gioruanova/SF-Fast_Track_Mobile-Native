import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackToHomeButton from '../../components/buttons/BackToHomeButton';
import MessageCard from '../../components/cards/MessageCard';
import PageHeader from '../../components/header/PageHeader';
import ScreenLayout from '../../components/layout/ScreenLayout';
import Icons from '../../components/ui/Icons';
import { COLORS } from '../../constants/theme';
import { useMessages } from '../../hooks/useMessages';
import type { Message } from '../../types/message';

export default function MensajesScreen() {
  const { messages, loading, error, refreshing, refresh, markAsRead, unreadCount } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleMessagePress = async (message: Message) => {
    setSelectedMessage(message);
    if (message.is_read === 0) {
      await markAsRead(message.id);
    }
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  const cleanHtmlContent = (content: string) => {
    return content.replace(/<[^>]*>/g, '');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <ScreenLayout>
        <PageHeader
          title="Mensajes"
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          disabled={loading}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando mensajes...</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout>
        <PageHeader
          title="Mensajes"
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <View style={styles.centerContainer}>
          <Icons.AlertCircle size={48} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollable={false}>
      <PageHeader
        title="Mensajes"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        disabled={loading}
      />

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icons.MessageCircle size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>No tienes mensajes</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            unreadCount > 0 ? (
              <View style={styles.unreadBanner}>
                <Icons.Mail size={20} color={COLORS.primary} />
                <Text style={styles.unreadText}>
                  {unreadCount} mensaje{unreadCount !== 1 ? 's' : ''} sin leer
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <MessageCard message={item} onPress={handleMessagePress} />
          )}
          ListFooterComponent={<BackToHomeButton />}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      <Modal
        visible={selectedMessage !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del Mensaje</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icons.Close size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            {selectedMessage && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.messageDetail}>
                  <View style={styles.detailRow}>
                    <Icons.User size={18} color={COLORS.gray} />
                    <Text style={styles.detailLabel}>De:</Text>
                    <Text style={styles.detailValue}>
                      {selectedMessage.platformMessage.message_sender}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Icons.Calendar size={18} color={COLORS.gray} />
                    <Text style={styles.detailLabel}>Fecha:</Text>
                    <Text style={styles.detailValue}>
                      {formatDateTime(selectedMessage.created_at)}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.messageTitle}>
                    {selectedMessage.platformMessage.platform_message_title}
                  </Text>

                  <Text style={styles.messageContent}>
                    {cleanHtmlContent(selectedMessage.platformMessage.platform_message_content)}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
                <Text style={styles.closeModalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  unreadText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.gray,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  messageDetail: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  messageContent: {
    fontSize: 16,
    color: COLORS.black,
    lineHeight: 24,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  closeModalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});

