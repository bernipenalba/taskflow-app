import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import ProfileCard from '../components/ProfileCard';
import { profileData } from '../data/profileData';

// El título "Perfil" ya lo muestra el header nativo del Tab (ver AppNavigator.js).
const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ProfileCard
        name={profileData.name}
        role={profileData.role}
        image={profileData.image}
      />
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
});

export default ProfileScreen;

