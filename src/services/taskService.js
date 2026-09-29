import { db } from '../config/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

// Nombre de la colección en una constante, en vez de escribir 'tasks'
// suelto en cada función (misma idea contra los "strings mágicos" del
// Módulo 6).
const TASKS_COLLECTION = 'tasks';

// Se suscribe en tiempo real a las tareas de UN usuario puntual.
// Devuelve la función de "unsubscribe" que hay que llamar al desmontar
// (ver el useEffect de AppNavigator.js).
export const subscribeToUserTasks = (userId, onTasksChange) => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const tasksQuery = query(
    tasksRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(tasksQuery, (snapshot) => {
    const tasks = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    onTasksChange(tasks);
  });
};

export const addTaskToFirestore = async (userId, task) => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const docRef = await addDoc(tasksRef, {
    ...task,
    userId,
    completed: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTaskInFirestore = (taskId, changes) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  return updateDoc(taskRef, changes);
};

export const deleteTaskFromFirestore = (taskId) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  return deleteDoc(taskRef);
};
