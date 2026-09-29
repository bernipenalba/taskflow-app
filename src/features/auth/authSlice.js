import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  // Arranca en true: todavía no sabemos si hay una sesión guardada en el
  // dispositivo. Evita el "parpadeo" de mostrar el login un instante aunque
  // el usuario ya estuviera logueado (ver AppNavigator.js).
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isCheckingAuth = false;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

// ---------- Selectores ----------
export const selectUser = (state) => state.auth.user;
export const selectIsCheckingAuth = (state) => state.auth.isCheckingAuth;
