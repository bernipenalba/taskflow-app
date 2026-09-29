import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { subscribeToUserTasks } from '../services/taskService';
import { setUser, selectUser, selectIsCheckingAuth } from '../features/auth/authSlice';
import { setTasks, clearTasks } from '../features/tasks/tasksSlice';
import { colors } from '../constants/colors';

import MainTabs from './MainTabs';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

// Navegación protegida: en vez de ocultar una pantalla, decide CUÁL de dos
// árboles de navegación completos se monta. Mientras user sea null, MainTabs
// (y las tareas de cualquiera) directamente no existe en este render.
export default function AppNavigator() {
  const user = useSelector(selectUser);
  const isCheckingAuth = useSelector(selectIsCheckingAuth);
  const dispatch = useDispatch();

  // Restaura la sesión al arrancar. Firebase ya guardó el token de forma
  // segura en el dispositivo; este listener solo pregunta cuál es la
  // situación actual, y se vuelve a disparar cada vez que cambia (login/logout).
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // firebaseUser trae métodos y datos no serializables: se guarda
        // solo una versión chica y plana (regla del Módulo 6).
        dispatch(setUser({ uid: firebaseUser.uid, email: firebaseUser.email }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribeAuth();
  }, [dispatch]);

  // Escucha las tareas del usuario activo. Se vuelve a armar cada vez que
  // `user` cambia (login, logout, o cambio de cuenta), y SIEMPRE se limpia
  // el listener anterior antes de crear uno nuevo, para no seguir recibiendo
  // tareas de una sesión que ya cerró.
  useEffect(() => {
    if (!user) {
      dispatch(clearTasks());
      return;
    }

    const unsubscribeTasks = subscribeToUserTasks(user.uid, (tasks) => {
      dispatch(setTasks(tasks));
    });

    return () => unsubscribeTasks();
  }, [user, dispatch]);

  // Mientras no se sepa si hay sesión guardada, no se muestra ni Login ni
  // Tareas: evita el "parpadeo" de saltar al login un instante aunque el
  // usuario ya estuviera logueado.
  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
