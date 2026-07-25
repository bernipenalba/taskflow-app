import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const ProfileCard = ({ name, role, image }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginRight: 16,
        backgroundColor: colors.border,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    role: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
});

export default ProfileCard;

