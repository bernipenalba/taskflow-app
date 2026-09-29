import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';
const AVATAR_SIZE = 300; // px — un avatar no necesita más resolución que esto

// Abre la galería, deja recortar en cuadrado, y devuelve la foto ya
// redimensionada y comprimida como data URI (base64), lista para guardar
// en Firestore. Devuelve null si el usuario canceló — nunca lanza un error
// en ese caso, para no romper la pantalla.
export const pickAvatarFromLibrary = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Necesitamos permiso para acceder a tus fotos.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  // Se redimensiona y comprime ACÁ (no en el reducer ni en el componente):
  // Firestore tiene un límite de 1MB por documento, así que hay que
  // garantizar que el avatar sea chico sin importar el tamaño de la foto
  // original del teléfono.
  const context = ImageManipulator.manipulate(result.assets[0].uri);
  context.resize({ width: AVATAR_SIZE, height: AVATAR_SIZE });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({
    compress: 0.5,
    format: SaveFormat.JPEG,
    base64: true,
  });

  return `data:image/jpeg;base64,${saved.base64}`;
};

export const saveAvatarToFirestore = (userId, photoURL) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  return setDoc(userRef, { photoURL }, { merge: true });
};

export const fetchAvatarFromFirestore = async (userId) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data().photoURL ?? null : null;
};
