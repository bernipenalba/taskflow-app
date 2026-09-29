import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Estilo de header compartido por todas las pantallas con encabezado nativo
const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
};

// Stack de "Tareas": Lista -> Detalle -> Formulario.
// Cada pantalla lee y modifica el store directo con useSelector/useDispatch
// (ver src/features/tasks/tasksSlice.js), así que alcanza con el registro
// simple component={Screen}.
function TasksStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: 'Mis tareas' }}
      />

      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={({ route }) => ({ title: route.params?.title ?? 'Detalle' })}
      />

      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={{ title: 'Nueva tarea' }}
      />
    </Stack.Navigator>
  );
}

// La app "autenticada": pestañas Tareas/Perfil. Se monta entera cuando
// AppNavigator detecta un usuario logueado (ver src/navigation/AppNavigator.js).
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          const iconName =
            route.name === 'Home'
              ? focused
                ? 'list'
                : 'list-outline'
              : focused
                ? 'person'
                : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={TasksStack} options={{ headerShown: false, title: 'Tareas' }} />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil', ...headerOptions }}
      />
    </Tab.Navigator>
  );
}
