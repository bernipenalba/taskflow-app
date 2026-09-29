import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { registerWithEmail } from '../../services/authService';

// Igual que en LoginScreen: no hace falta navegar "a mano" tras registrarse.
// Crear la cuenta también inicia sesión del lado de Firebase, así que el
// listener onAuthStateChanged de AppNavigator.js se entera solo y cambia
// el árbol de navegación al stack de Tareas.
const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmitDisabled = !email.trim() || password.length < 6 || isSubmitting;

    const handleRegister = async () => {
        setFormError('');

        if (password !== confirmPassword) {
            setFormError('Las contraseñas no coinciden.');
            return;
        }

        setIsSubmitting(true);
        try {
            await registerWithEmail(email.trim(), password);
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Crear cuenta</Text>
                    <Text style={styles.subtitle}>Registrate para empezar a usar TaskFlow.</Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@email.com"
                            placeholderTextColor={colors.textPlaceholder}
                            selectionColor={colors.primary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            returnKeyType="next"
                        />

                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mínimo 6 caracteres"
                            placeholderTextColor={colors.textPlaceholder}
                            selectionColor={colors.primary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            returnKeyType="next"
                        />

                        <Text style={styles.label}>Repetir contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Repetí la contraseña"
                            placeholderTextColor={colors.textPlaceholder}
                            selectionColor={colors.primary}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            returnKeyType="done"
                            onSubmitEditing={handleRegister}
                        />

                        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button, isSubmitDisabled && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={isSubmitDisabled}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.linkText}>¿Ya tenés cuenta? Ingresá</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    wrapper: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
    title: { fontSize: 26, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 4 },
    subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
    card: {
        backgroundColor: colors.surface,
        borderRadius: colors.radius.lg,
        padding: 20,
        ...colors.shadow.card,
    },
    label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: 16 },
    input: {
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: colors.radius.md,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
    },
    errorText: { color: colors.error, fontSize: 13, marginTop: 12, textAlign: 'center' },
    button: {
        backgroundColor: colors.primary,
        borderRadius: colors.radius.md,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
        ...colors.shadow.card,
    },
    buttonDisabled: { backgroundColor: colors.textPlaceholder, shadowOpacity: 0, elevation: 0 },
    buttonText: { color: colors.surface, fontSize: 16, fontWeight: '700' },
    linkButton: { alignItems: 'center', paddingVertical: 20 },
    linkText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});

export default RegisterScreen;
