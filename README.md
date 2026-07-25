# TaskFlow

Aplicación móvil de gestión de tareas, construida con React Native y Expo
como proyecto final del curso de desarrollo de apps móviles.

## Checkpoint 2: Estructura profesional, ProfileCard y Safe Area

En este checkpoint se organizó el proyecto siguiendo una arquitectura
profesional (`src/screens`, `src/components`, `src/constants`, `src/data`),
se construyó el componente reutilizable `ProfileCard` (recibe sus datos
por props, sin datos hardcodeados), y se agregó soporte de Safe Area con
`react-native-safe-area-context` para respetar notch y barras del
dispositivo.

Pantallas que se pueden visualizar actualmente:
- **ProfileScreen**: muestra el `ProfileCard` con datos leídos desde
  `src/data/profileData.js` (es la pantalla configurada en `App.js`).
- **HomeScreen**: estructura base creada, todavía sin datos reales.

## Estructura del proyecto

```
src/
  components/
    ProfileCard.js
  screens/
    HomeScreen.js
    ProfileScreen.js
    WelcomeScreen.js
  constants/
    colors.js
  data/
    profileData.js
  assets/
```
## Cómo correrlo localmente

1. Cloná este repositorio.
2. Instalá las dependencias:
   ```
   npm install
   ```
3. Iniciá el proyecto:
   ```
   npx expo start
   ```
4. Escaneá el código QR con Expo Go, o presioná `a` para abrir en el
   emulador de Android.
