import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
// Recibe tasks/addTask desde AppNavigator y se los pasa a cada pantalla por props
// (todavía no hay Redux/Context — eso llega en el Módulo 6).
function TasksStack({ tasks, addTask }) {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="TaskList" options={{ title: 'Mis tareas' }}>
        {(props) => <TaskListScreen {...props} tasks={tasks} />}
      </Stack.Screen>

      <Stack.Screen
        name="TaskDetail"
        options={({ route }) => ({ title: route.params?.title ?? 'Detalle' })}
      >
        {(props) => <TaskDetailScreen {...props} tasks={tasks} />}
      </Stack.Screen>

      <Stack.Screen name="TaskForm" options={{ title: 'Nueva tarea' }}>
        {(props) => <TaskFormScreen {...props} onAddTask={addTask} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  // Las tareas viven acá: es el ancestro común de TaskList, TaskDetail y TaskForm.
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    const taskWithId = { id: Date.now().toString(), ...task };
    setTasks((prevTasks) => [taskWithId, ...prevTasks]);
  };

  return (
    <NavigationContainer>
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
        <Tab.Screen name="Home" options={{ headerShown: false, title: 'Tareas' }}>
          {() => <TasksStack tasks={tasks} addTask={addTask} />}
        </Tab.Screen>

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Perfil', ...headerOptions }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
