// src/App.tsx
import { useState, useEffect } from 'react';
import { auth } from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { logoutUser } from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import NotesDashboard from './components/NotesDashboard';
import type { User as AppUser } from './types/Note';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Convertir Firebase User a nuestro User type
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          createdAt: null
        };
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <NotesDashboard user={currentUser} onLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {isLogin ? (
        <Login onToggle={handleToggle} onLoginSuccess={() => {}} />
      ) : (
        <Register onToggle={handleToggle} onRegisterSuccess={() => {}} />
      )}
    </div>
  );
}

export default App;