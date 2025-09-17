import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import type { Note } from '../types/Note';

export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'tareas'), {
      ...note,
      userId: note.userId, // ← Asegúrate de que esto esté presente
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const getNotesByUser = async (userId: string): Promise<Note[]> => {
  try {
    console.log('🔍 Buscando notas para usuario:', userId);
    
    const q = query(
      collection(db, 'tareas'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];
    
    console.log(`📄 Encontradas ${querySnapshot.size} notas`);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Debug: mostrar datos crudos
      console.log('📋 Datos crudos:', {
        id: doc.id,
        data: data,
        createdAtType: typeof data.createdAt,
        hasToDate: !!data.createdAt?.toDate
      });
      
      const note: Note = {
        id: doc.id,
        title: data.title || 'Sin título',
        content: data.content || '',
        userId: data.userId || userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
      
      notes.push(note);
    });
    
    return notes;
  } catch (error: any) {
    console.error('❌ Error detallado al obtener notas:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    console.error('Error completo:', error);
    throw error;
  }
};

export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'tareas', noteId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tareas', noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};