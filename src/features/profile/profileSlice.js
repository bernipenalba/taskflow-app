import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // data URI (base64) de la foto de perfil, o null si el usuario todavía
  // no subió ninguna (en ese caso, ProfileScreen usa una imagen por defecto).
  photoURL: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setPhotoURL: (state, action) => {
      state.photoURL = action.payload;
    },
    clearProfile: (state) => {
      state.photoURL = null;
    },
  },
});

export const { setPhotoURL, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

// ---------- Selectores ----------
export const selectPhotoURL = (state) => state.profile.photoURL;
