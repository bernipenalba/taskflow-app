# TaskFlow

Aplicación móvil de gestión de tareas, construida con React Native y Expo
como proyecto final del curso de desarrollo de apps móviles.

## Módulo 5: Navegación con React Navigation

TaskFlow pasó de simular pantallas con un estado booleano (`selectedTask`)
a una navegación real con [React Navigation](https://reactnavigation.org/).
La estructura, de afuera hacia adentro, es:

```
NavigationContainer
  Tab.Navigator (barra de pestañas, siempre visible abajo)
    ├─ "Home"    -> Stack.Navigator (TasksStack)
    │                 ├─ TaskList   (lista de tareas)
    │                 ├─ TaskDetail (detalle de una tarea)
    │                 └─ TaskForm   (formulario de nueva tarea)
    └─ "Profile" -> ProfileScreen
```

**Por qué esta estructura (Tabs afuera, Stack adentro):** la barra de
pestañas de abajo queda visible todo el tiempo, incluso navegando en
profundidad dentro de "Tareas" — el mismo patrón que usa Instagram, donde
las pestañas nunca desaparecen ni siquiera viendo el detalle de una
publicación. El `Tab.Screen` de "Home" oculta su propio header
(`headerShown: false`) porque el `Stack.Navigator` interno ya pone uno
propio por pantalla (título dinámico según dónde estés parado).

**Dónde vive el estado:** el array `tasks` y la función `addTask` viven en
`AppNavigator.js` (el ancestro común de las tres pantallas del Stack de
tareas) y bajan a cada pantalla por props. Al tocar una tarea en la lista,
se navega pasando solo su `id` (`navigation.navigate('TaskDetail', { taskId })`);
`TaskDetailScreen` busca ese `id` dentro de `tasks` para mostrar el detalle
completo. El formulario, al guardar, llama a `addTask` y navega de vuelta
con `navigation.navigate('TaskList')`.

## Checkpoint 2: Estructura profesional, ProfileCard y Safe Area

En este checkpoint se organizó el proyecto siguiendo una arquitectura
profesional (`src/screens`, `src/components`, `src/constants`, `src/data`),
se construyó el componente reutilizable `ProfileCard` (recibe sus datos
por props, sin datos hardcodeados), y se agregó soporte de Safe Area con
`react-native-safe-area-context` para respetar notch y barras del
dispositivo.

## Estructura del proyecto

```
App.js
index.js
src/
  navigation/
    AppNavigator.js     (Tab + Stack, y dueño del estado `tasks`)
  components/
    ProfileCard.js
    EmptyState.js
  screens/
    TaskListScreen.js
    TaskDetailScreen.js
    TaskFormScreen.js
    ProfileScreen.js
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
