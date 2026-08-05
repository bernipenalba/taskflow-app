import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

const TaskDetailScreen = ({ task, onBack }) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backButtonText}>‹ Volver</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{task.category}</Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.date}>Creada el {formattedDate}</Text>

        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: colors.radius.lg,
    padding: 20,
    ...colors.shadow.card,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: colors.radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});

export default TaskDetailScreen;
