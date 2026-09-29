import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { setPhotoURL } from '../features/profile/profileSlice';
import { pickAvatarFromLibrary, saveAvatarToFirestore } from '../services/profileService';

// Hook personalizado: junta la lógica de "elegir una foto y guardarla" en
// un solo lugar, para que ProfileScreen no tenga que conocer ni el picker
// nativo ni Firestore — solo llama a changeAvatar() y lee isUploading.
export const useAvatarPicker = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const changeAvatar = async () => {
    setIsUploading(true);
    try {
      const photoURL = await pickAvatarFromLibrary();

      if (!photoURL) {
        return; // el usuario canceló la selección: no es un error
      }

      await saveAvatarToFirestore(user.uid, photoURL);
      dispatch(setPhotoURL(photoURL));
    } finally {
      setIsUploading(false);
    }
  };

  return { changeAvatar, isUploading };
};
