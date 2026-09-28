import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../constants/colors';
import EmptyState from '../components/EmptyState';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import { selectVisibleTasks, selectTaskFilter, setFilter } from '../features/tasks/tasksSlice';

// navigation llega automáticamente: esta pantalla está registrada en un Stack.Screen.
// tasks y filter ya NO llegan por props: se leen directo del store.
const TaskListScreen = ({ navigation }) => {
  const visibleTasks = useSelector(selectVisibleTasks);
  const filter = useSelector(selectTaskFilter);
  const dispatch = useDispatch();

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id, title: item.title })}
      activeOpacity={0.7}
    >
      <View style={styles.taskItemHeader}>
        <Text
          style={[styles.taskItemTitle, item.completed && styles.taskItemTitleDone]}
          numberOfLines={1}
        >
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
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('TaskForm')}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>+ Nueva tarea</Text>
            </TouchableOpacity>
            <TaskFilterBar value={filter} onChange={(newFilter) => dispatch(setFilter(newFilter))} />
          </>
        }
        ListEmptyComponent={<EmptyState />}
      />
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: colors.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
    ...colors.shadow.card,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
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
  taskItemTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
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

export default TaskListScreen;
