import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  type UserCredential,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: any;
}

export const registerUser = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> => {
  try {
    console.log('Registrando usuario...');
    
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const user = userCredential.user;
    console.log('Usuario creado en Auth:', user.uid);

    // Actualizar el perfil con displayName si se proporciona
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }

    // Crear objeto de usuario para Firestore (sin funciones de Firebase)
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || '',
      createdAt: serverTimestamp()
    };

    console.log('Intentando guardar en Firestore:', userData);

    // Guardar usuario en Firestore
    await setDoc(doc(db, 'usuarios', user.uid), userData);
    
    console.log('Usuario guardado exitosamente en Firestore');
    
    return {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || '',
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error completo en registerUser:', error);
    throw error;
  }
};

export const loginUser = async (
  email: string, 
  password: string
): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const user = userCredential.user;
    
    // Obtener datos de Firestore
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        uid: user.uid,
        email: user.email!,
        displayName: userData.displayName || '',
        createdAt: userData.createdAt
      };
    } else {
      // Si no existe en Firestore, crear el documento
      const newUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'usuarios', user.uid), newUserData);
      
      return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        createdAt: new Date()
      };
    }
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error en logoutUser:', error);
    throw error;
  }
};