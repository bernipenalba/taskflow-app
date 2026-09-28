import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { TASK_FILTERS } from '../../features/tasks/tasksSlice';

const FILTERS = [
  { label: 'Todas', value: TASK_FILTERS.ALL },
  { label: 'Pendientes', value: TASK_FILTERS.PENDING },
  { label: 'Completadas', value: TASK_FILTERS.COMPLETED },
];

// Componente de presentacion: no importa nada de Redux. Solo recibe el
// filtro activo (value) y avisa cuando el usuario elige otro (onChange).
// La pantalla que lo use es la que lo conecta con useSelector/useDispatch.
const TaskFilterBar = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = filter.value === value;
        return (
          <Pressable
            key={filter.value}
            style={[styles.filterButton, isActive && styles.filterButtonActive]}
            onPress={() => onChange(filter.value)}
          >
            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: colors.radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
});

export default TaskFilterBar;
