import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import ProfileCard from '../components/ProfileCard';
import { profileData } from '../data/profileData';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>
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
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
});

export default ProfileScreen;

