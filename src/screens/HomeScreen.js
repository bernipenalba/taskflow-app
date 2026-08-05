import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import AddTaskScreen from './AddTaskScreen';
import TaskDetailScreen from './TaskDetailScreen';
import EmptyState from '../components/EmptyState';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Recibe la tarea que arma AddTaskScreen y la agrega a la lista, con un id único
  const handleAddTask = (task) => {
    const taskWithId = { id: Date.now().toString(), ...task };
    setTasks((prevTasks) => [taskWithId, ...prevTasks]);
  };

  // Si hay una tarea seleccionada, esta pantalla se reemplaza entera por el detalle
  if (selectedTask) {
    return (
      <TaskDetailScreen
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => setSelectedTask(item)}
      activeOpacity={0.7}
    >
      <View style={styles.taskItemHeader}>
        <Text style={styles.taskItemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.taskItemBadge}>
          <Text style={styles.taskItemBadgeText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.taskItemDescription} numberOfLines={1}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <AddTaskScreen onAddTask={handleAddTask} />
              <Text style={styles.listTitle}>Mis tareas</Text>
            </>
          }
          ListEmptyComponent={<EmptyState />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  taskItem: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: colors.radius.md,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 10,
  },
  taskItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  taskItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  taskItemBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: colors.radius.xl,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  taskItemBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  taskItemDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
