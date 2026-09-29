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
import { loginWithEmail } from '../../services/authService';

// navigation llega automáticamente: esta pantalla está registrada en AuthStack.
// No hace falta hacer nada con el resultado del login: en cuanto Firebase
// confirma la sesión, el listener onAuthStateChanged de AppNavigator.js
// actualiza el store y la app entera cambia sola al stack de Tareas.
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmitDisabled = !email.trim() || password.length < 6 || isSubmitting;

    const handleLogin = async () => {
        setFormError('');
        setIsSubmitting(true);
        try {
            await loginWithEmail(email.trim(), password);
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
                    <Text style={styles.title}>TaskFlow</Text>
                    <Text style={styles.subtitle}>Iniciá sesión para ver tus tareas.</Text>

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
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />

                        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button, isSubmitDisabled && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isSubmitDisabled}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('Register')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.linkText}>¿No tenés cuenta? Registrate</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    wrapper: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 4 },
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

export default LoginScreen;
