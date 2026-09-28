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

**Dónde vive el estado:** al tocar una tarea en la lista, se navega pasando
solo su `id` (`navigation.navigate('TaskDetail', { taskId })`); del otro
lado, `TaskDetailScreen` usa ese `id` para pedir el detalle completo (ver
Módulo 6 — desde ahí el array de tareas ya no vive en `AppNavigator.js`,
sino en el store de Redux).

## Módulo 6: Estado global con Redux Toolkit

Las tareas y el filtro activo dejaron de vivir en un `useState` local y
pasaron a un **store de Redux**, con [Redux Toolkit](https://redux-toolkit.js.org/)
(`@reduxjs/toolkit` + `react-redux`). Estructura (organización por
funcionalidad, como ya usábamos en `screens`/`components`):

```
src/
  store/
    store.js              configureStore({ reducer: { tasks: ... } })
  features/
    tasks/
      tasksSlice.js        estado inicial, reducers, acciones y selectores
  components/
    tasks/
      TaskFilterBar.js     componente de presentación (no conoce Redux)
```

**El flujo, de punta a punta:** `App.js` envuelve todo con
`<Provider store={store}>` (por fuera de `SafeAreaProvider` y del
navegador), así que cualquier pantalla puede engancharse al store con los
Hooks de `react-redux`:

- **Leer datos** → `useSelector`. `TaskListScreen` usa `selectVisibleTasks`
  (memoizado con `createSelector`, ya filtrado según `state.tasks.filter`);
  `TaskDetailScreen` usa `selectTaskById(taskId)` para traer una tarea
  puntual.
- **Modificar datos** → `useDispatch`. `TaskFormScreen` despacha `addTask`,
  `TaskDetailScreen` despacha `toggleTaskStatus` y `deleteTask`, y
  `TaskListScreen` despacha `setFilter` cuando se toca un botón de
  `TaskFilterBar`.

Como el estado ya no vive en `AppNavigator.js`, las pantallas del Stack de
tareas volvieron a registrarse con la forma simple
(`<Stack.Screen component={TaskListScreen} />`) en vez del patrón
`children` que hacía falta en el Checkpoint 5 para pasarles `tasks` por
props — ya no hace falta: cada una lee directo del store.

`TaskFilterBar` es un componente de **presentación pura**: recibe
`value`/`onChange` por props y no importa nada de Redux, así que se podría
reusar en cualquier otra pantalla sin cambiarle una línea.

## Checkpoint 2: Estructura profesional, ProfileCard y Safe Area

En este checkpoint se organizó el proyecto siguiendo una arquitectura
profesional (`src/screens`, `src/components`, `src/constants`, `src/data`),
se construyó el componente reutilizable `ProfileCard` (recibe sus datos
por props, sin datos hardcodeados), y se agregó soporte de Safe Area con
`react-native-safe-area-context` para respetar notch y barras del
dispositivo.

## Estructura del proyecto

```
App.js                  (envuelve todo con <Provider store={store}>)
index.js
src/
  navigation/
    AppNavigator.js      (Tab + Stack de pantallas)
  store/
    store.js              (configureStore)
  features/
    tasks/
      tasksSlice.js        (estado, reducers, acciones y selectores de tareas)
  components/
    ProfileCard.js
    EmptyState.js
    tasks/
      TaskFilterBar.js
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
