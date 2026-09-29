import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { colors } from '../constants/colors';
import { selectTaskById } from '../features/tasks/tasksSlice';
import { updateTaskInFirestore, deleteTaskFromFirestore } from '../services/taskService';

// route y navigation llegan automáticamente (pantalla registrada en el Stack).
// La tarea ya no llega por props: se busca en el store por id (y el store,
// a su vez, se llena con lo que reporte el listener de Firestore).
const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const task = useSelector(selectTaskById(taskId));
  const [isUpdating, setIsUpdating] = useState(false);

  // Defensivo: si el id no matchea ninguna tarea (por ejemplo, se borró
  // mientras esta pantalla seguía en la pila), evitamos que la app crashee.
  if (!task) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <Text style={styles.notFound}>Esta tarea ya no existe.</Text>
      </SafeAreaView>
    );
  }

  // task.createdAt llega como un Timestamp de Firestore (tiene .toDate()),
  // no como texto ISO ni como Date de JS. Justo después de crear la tarea,
  // mientras el servidor todavía no confirmó el serverTimestamp(), puede
  // llegar como null por un instante — por eso el chequeo defensivo.
  const createdDate = task.createdAt?.toDate ? task.createdAt.toDate() : null;
  const formattedDate = createdDate
    ? createdDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Guardando...';

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await updateTaskInFirestore(task.id, { completed: !task.completed });
    } catch (error) {
      Alert.alert('No se pudo actualizar', error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar tarea', '¿Seguro que querés eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTaskFromFirestore(task.id);
            navigation.navigate('TaskList');
          } catch (error) {
            Alert.alert('No se pudo eliminar', error.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.card}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{task.category}</Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.date}>Creada el {formattedDate}</Text>

        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.description}>{task.description}</Text>

        <TouchableOpacity
          style={[styles.toggleButton, task.completed && styles.toggleButtonDone]}
          onPress={handleToggle}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleButtonText, task.completed && styles.toggleButtonTextDone]}>
            {task.completed ? '✓ Completada' : 'Marcar como completada'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
        <Text style={styles.deleteButtonText}>Eliminar tarea</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  notFound: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
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
    marginBottom: 24,
  },
  toggleButton: {
    backgroundColor: colors.primary,
    borderRadius: colors.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  toggleButtonDone: {
    backgroundColor: colors.accentSoft,
  },
  toggleButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  toggleButtonTextDone: {
    color: colors.accent,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TaskDetailScreen;
