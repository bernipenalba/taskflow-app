import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

export const TASK_FILTERS = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

const initialState = {
  items: [
    {
      id: 'task-1',
      title: 'Repasar navegación',
      description: 'Revisar el flujo Stack + Tabs antes de seguir con Redux.',
      category: 'Estudio',
      completed: true,
      createdAt: '2026-09-20T14:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Configurar Redux Toolkit',
      description: 'Crear el store, el tasksSlice y conectar el Provider.',
      category: 'TaskFlow',
      completed: false,
      createdAt: '2026-09-21T14:00:00.000Z',
    },
    {
      id: 'task-3',
      title: 'Probar filtros globales',
      description: 'Cambiar el filtro, navegar al detalle y verificar que se mantenga.',
      category: 'Práctica',
      completed: false,
      createdAt: '2026-09-22T14:00:00.000Z',
    },
  ],
  filter: TASK_FILTERS.ALL,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      // prepare arma el payload ANTES de que la accion llegue al reducer:
      // acá va lo "impuro" (id al azar, fecha actual), para que el reducer
      // siga siendo una funcion pura.
      prepare: ({ title, description = '', category = 'General' }) => ({
        payload: {
          id: nanoid(),
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || 'General',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      }),
    },
    toggleTaskStatus: (state, action) => {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setFilter: (state, action) => {
      const isValidFilter = Object.values(TASK_FILTERS).includes(action.payload);
      if (isValidFilter) {
        state.filter = action.payload;
      }
    },
  },
});

export const { addTask, toggleTaskStatus, deleteTask, setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;

// ---------- Selectores ----------
// Se escriben una sola vez acá y se exportan, para que las pantallas no
// necesiten conocer la forma interna del estado (state.tasks.items).

export const selectTaskItems = (state) => state.tasks.items;
export const selectTaskFilter = (state) => state.tasks.filter;

// Selector "parametrizado": devuelve una funcion selector para un id puntual.
export const selectTaskById = (taskId) => (state) =>
  state.tasks.items.find((item) => item.id === taskId);

// Devuelve un array calculado (depende del filtro) -> createSelector memoiza
// el resultado para no generar redibujados de mas cuando el store cambia
// por algo que no tiene nada que ver con las tareas o el filtro.
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
