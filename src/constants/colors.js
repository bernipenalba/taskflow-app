export const colors = {
  // Marca
  primary: '#4F46E5',       // indigo 600 — color principal (botones, títulos activos)
  primaryLight: '#818CF8',  // indigo 400 — hover/focus, detalles suaves
  primaryDark: '#4338CA',   // indigo 700 — estado "presionado" del botón
  accent: '#14B8A6',        // teal 500 — acento moderno (categorías, chips seleccionados)
  accentSoft: '#E6FBF7',   // teal muy claro — fondo de badges de categoría (texto encima con `accent`)
  secondary: '#F59E0B',     // amber — ya lo tenías, se mantiene

  // Semánticos (para validación)
  success: '#10B981',
  error: '#EF4444',
  errorLight: '#FEF2F2',    // fondo suave rosado para inputs con error
  warning: '#F59E0B',

  // Neutros / superficies
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',    // fondo de los inputs en reposo
  border: '#E2E8F0',
  borderFocus: '#4F46E5',   // borde del input cuando el usuario lo está tocando
  text: '#0F172A',
  textSecondary: '#64748B',
  textPlaceholder: '#94A3B8',

  // Tokens de efectos (para no repetir números en cada componente)
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};