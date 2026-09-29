import { db } from '../config/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

// Nombre de la colección en una constante, en vez de escribir 'tasks'
// suelto en cada función (misma idea contra los "strings mágicos" del
// Módulo 6).
const TASKS_COLLECTION = 'tasks';

// Firestore devuelve createdAt como un Timestamp (un objeto con .toDate(),
// no un texto ni un Date de JS). Redux exige estado serializable (Módulo 6),
// así que se convierte ACÁ, en la capa de servicios, a texto ISO — las
// pantallas ni se enteran de que Firestore usa un tipo de dato propio.
// Justo después de crear una tarea, mientras el servidor todavía no
// confirmó el serverTimestamp(), puede llegar como null por un instante.
const toPlainTask = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
  };
};

// Más nueva primero. Se ordena acá (no con orderBy() en la consulta) para
// no necesitar un índice compuesto en Firestore: combinar un where() con
// un orderBy() sobre un campo DISTINTO exige crear ese índice a mano en la
// consola, y mientras no existe, la consulta falla en silencio. Con pocas
// tareas por usuario, ordenar del lado de la app sale gratis.
const sortByNewest = (tasks) =>
  [...tasks].sort((a, b) => {
    const aMs = a.createdAt ? new Date(a.createdAt).getTime() : Date.now();
    const bMs = b.createdAt ? new Date(b.createdAt).getTime() : Date.now();
    return bMs - aMs;
  });

// Se suscribe en tiempo real a las tareas de UN usuario puntual.
// Devuelve la función de "unsubscribe" que hay que llamar al desmontar
// (ver el useEffect de AppNavigator.js).
export const subscribeToUserTasks = (userId, onTasksChange) => {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const tasksQuery = query(tasksRef, where('userId', '==', userId));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map(toPlainTask);
      onTasksChange(sortByNewest(tasks));
    },
    (error) => {
      // Si la consulta fallara (por ejemplo, falta de permisos en las
      // Security Rules), esto lo deja visible en la consola de Metro en
      // vez de fallar en silencio.
      console.error('Error escuchando las tareas:', error);
    }
  );
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
