import React, { useState } from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { colors } from '../constants/colors';
import ProfileCard from '../components/ProfileCard';
import { profileData } from '../data/profileData';
import { selectUser } from '../features/auth/authSlice';
import { logout } from '../services/authService';

// El título "Perfil" ya lo muestra el header nativo del Tab (ver MainTabs.js).
// No hace falta navegar tras cerrar sesión: en cuanto Firebase confirma el
// logout, el listener onAuthStateChanged de AppNavigator.js pone user en
// null y la app entera cambia sola al AuthStack.
const ProfileScreen = () => {
  const user = useSelector(selectUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await logout();
          } catch (error) {
            Alert.alert('No se pudo cerrar sesión', error.message);
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ProfileCard
        name={profileData.name}
        role={profileData.role}
        image={profileData.image}
      />

      {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoggingOut}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutButtonText}>
          {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </Text>
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
  email: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 24,
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;
