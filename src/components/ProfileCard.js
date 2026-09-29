import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

// onAvatarPress es opcional: si no se pasa, la foto se muestra fija (como
// hasta el Checkpoint 7). Cuando se pasa, envuelve el avatar en un
// TouchableOpacity — mismo patrón de "componente de presentación + callback
// por props" que ya usamos con TaskFilterBar.
const ProfileCard = ({ name, role, image, onAvatarPress, isUploading }) => {
  const avatar = <Image source={{ uri: image }} style={styles.avatar} />;

  return (
    <View style={styles.card}>
      {onAvatarPress ? (
        <TouchableOpacity onPress={onAvatarPress} disabled={isUploading} activeOpacity={0.7}>
          {avatar}
          {isUploading ? (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color={colors.surface} />
            </View>
          ) : null}
        </TouchableOpacity>
      ) : (
        avatar
      )}
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
    avatarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 16, // mismo marginRight que avatar, para cubrir exactamente el círculo
        bottom: 0,
        borderRadius: 36,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
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

