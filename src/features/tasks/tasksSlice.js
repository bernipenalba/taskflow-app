import { createSelector, createSlice } from '@reduxjs/toolkit';

export const TASK_FILTERS = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

const initialState = {
  // Ya no hay tareas de ejemplo escritas a mano: ahora Firestore es la
  // fuente de verdad. items arranca vacío y se llena con setTasks, que
  // dispara el listener en tiempo real (ver taskService.js y AppNavigator.js).
  items: [],
  filter: TASK_FILTERS.ALL,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Reemplaza toda la lista de una vez con lo último que reportó Firestore.
    // No busca ni calcula nada: esa lógica ya la resolvió el servidor.
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    // Se usa al cerrar sesión, para no dejar en pantalla (ni en memoria) las
    // tareas del usuario anterior mientras carga el siguiente.
    clearTasks: (state) => {
      state.items = [];
    },
    setFilter: (state, action) => {
      const isValidFilter = Object.values(TASK_FILTERS).includes(action.payload);
      if (isValidFilter) {
        state.filter = action.payload;
      }
    },
  },
});

export const { setTasks, clearTasks, setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;

// ---------- Selectores ----------
export const selectTaskItems = (state) => state.tasks.items;
export const selectTaskFilter = (state) => state.tasks.filter;

export const selectTaskById = (taskId) => (state) =>
  state.tasks.items.find((item) => item.id === taskId);

export const selectVisibleTasks = createSelector(
  [selectTaskItems, selectTaskFilter],
  (items, filter) => {
    if (filter === TASK_FILTERS.PENDING) {
      return items.filter((task) => !task.completed);
    }
    if (filter === TASK_FILTERS.COMPLETED) {
      return items.filter((task) => task.completed);
    }
    return items;
  }
);
