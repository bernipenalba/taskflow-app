import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const CATEGORIES = ['Personal', 'Trabajo', 'Urgente', 'Otro'];

const AddTaskScreen = ({ onAddTask }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]); // "Personal" por defecto
    const [errors, setErrors] = useState({ title: '', description: '' });
    const [touched, setTouched] = useState({ title: false, description: false });
    const [focusedField, setFocusedField] = useState(null); // 'title' | 'description' | null !!Este estado es UI

    // Valida un solo campo y devuelve el mensaje de error (o '' si está OK)
    const validateField = (field, value) => {
        const trimmed = value.trim();

        if (field === 'title') {
            if (!trimmed) return 'El título es obligatorio.';
            if (trimmed.length < 5) return 'El título debe tener al menos 5 caracteres.';
        }

        if (field === 'description') {
            if (!trimmed) return 'La descripción es obligatoria.';
            if (trimmed.length < 10) return 'La descripción debe tener al menos 10 caracteres.';
        }

        return '';
    };

    // Valida todo el formulario (se usa al intentar guardar)
    const validateForm = () => {
        setTouched({ title: true, description: true });

        const newErrors = {
            title: validateField('title', title),
            description: validateField('description', description),
        };

        setErrors(newErrors);
        return !newErrors.title && !newErrors.description;
        };

    const handleAddTask = () => {
        if (!validateForm()) {
            return; // hay campos inválidos, no seguimos
    }

    const newTask = {
            title: title.trim(),
            description: description.trim(),
            category,
            createdAt: new Date(),
    };

    console.log('Nueva tarea creada:', newTask);

    Alert.alert('Éxito', 'Tarea capturada localmente');

    onAddTask(newTask); // Le pasa la tarea a HomeScreen para que la agregue a la lista

    // Reset del formulario a su estado inicial
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setErrors({ title: '', description: '' });
    setTouched({ title: false, description: false });
    };

    // Se recalcula en cada render — no necesita useState porque depende
    // directamente de title/description, que ya son estado.
    const isSubmitDisabled = title.trim().length < 5 || description.trim().length < 10;

    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Nueva tarea</Text>
            <Text style={styles.subtitle}>Completá los datos y guardala con un toque.</Text>

            <View style={styles.card}>
                {/* Título */}
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={[
                        styles.input,
                        focusedField === 'title' && styles.inputFocused,
                        touched.title && errors.title ? styles.inputError : null,
                    ]}
                    placeholder="Ej: Terminar informe de ventas"
                    placeholderTextColor={colors.textPlaceholder}
                    selectionColor={colors.primary}
                    value={title}
                    onChangeText={setTitle}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => {
                        setFocusedField(null);
                        setTouched((prev) => ({ ...prev, title: true }));
                        setErrors((prev) => ({ ...prev, title: validateField('title', title) }));
                    }}
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    />
                    {touched.title && errors.title ? (
                    <Text style={styles.errorText}>{errors.title}</Text>
                    ) : null}

                 {/* Descripción */}
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.textArea,
                        focusedField === 'description' && styles.inputFocused,
                        touched.description && errors.description ? styles.inputError : null,
                    ]}
                    placeholder="Agregá detalles sobre la tarea..."
                    placeholderTextColor={colors.textPlaceholder}
                    selectionColor={colors.primary}
                    value={description}
                    onChangeText={setDescription}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => {
                        setFocusedField(null);
                        setTouched((prev) => ({ ...prev, description: true }));
                        setErrors((prev) => ({ ...prev, description: validateField('description', description) }));
                    }}
                    autoCapitalize="sentences"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    returnKeyType="done"
                    />
                    {touched.description && errors.description ? (
                    <Text style={styles.errorText}>{errors.description}</Text>
                    ) : null}

                {/* Categoría */}
                <Text style={styles.label}>Categoría</Text>
                <View style={styles.categoryRow}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                            styles.categoryChip,
                            category === cat && styles.categoryChipSelected,
                            ]}
                        onPress={() => setCategory(cat)}
                        activeOpacity={0.7}
                        >
                    <Text
                        style={[
                        styles.categoryChipText,
                        category === cat && styles.categoryChipTextSelected,
                        ]}
                    >
                    {cat}
                    </Text>
                    </TouchableOpacity>
                ))}
                
                </View>
                <TouchableOpacity
                    style={[styles.button, isSubmitDisabled && styles.buttonDisabled]}
                    onPress={handleAddTask}
                    disabled={isSubmitDisabled}
                    activeOpacity={0.8}
                >
                <Text style={styles.buttonText}>Guardar tarea</Text>
                </TouchableOpacity>
                </View>
                </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
    },
    title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    },
    subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    },
    card: {
    backgroundColor: colors.surface,
    borderRadius: colors.radius.lg,
    padding: 20,
    ...colors.shadow.card,
    },
    label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: 16,
    },
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
    inputFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.surface,
    },
    inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
    },
    textArea: {
    minHeight: 100,
    },
    errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    },
    categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    },
    categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: colors.radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    },
    categoryChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    },
    categoryChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    },
    categoryChipTextSelected: {
    color: colors.surface,
    fontWeight: '700',
    },
    button: {
    backgroundColor: colors.primary,
    borderRadius: colors.radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    ...colors.shadow.card,
    },
    buttonDisabled: {
    backgroundColor: colors.textPlaceholder,
    shadowOpacity: 0,
    elevation: 0,
    },
    buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    },


});

export default AddTaskScreen;
