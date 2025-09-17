// src/components/NotesDashboard.tsx (actualizado)
import { useState, useEffect } from 'react';
import type{ User, Note } from '../types/Note';
import { createNote, getNotesByUser, updateNote, deleteNote } from '../services/notesService';
import NoteForm from './NoteForm';
import NoteItem from './NoteItem';

interface NotesDashboardProps {
  user: User;
  onLogout: () => void;
}

const NotesDashboard: React.FC<NotesDashboardProps> = ({ user, onLogout }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadNotes();
  }, [user.uid]);

  const loadNotes = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔄 Cargando notas...');
      const userNotes = await getNotesByUser(user.uid);
      console.log('✅ Notas cargadas:', userNotes);
      setNotes(userNotes);
    } catch (error: any) {
      console.error('Error loading notes:', error);
      setError(`Error al cargar notas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData: { title: string; content: string }) => {
    setFormLoading(true);
    setError('');
    try {
      await createNote({
        ...noteData,
        userId: user.uid
      });
      await loadNotes();
    } catch (error: any) {
      console.error('Error creating note:', error);
      setError(`Error al crear nota: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateNote = async (noteData: { title: string; content: string }) => {
    if (!editingNote?.id) return;
    
    setFormLoading(true);
    setError('');
    try {
      await updateNote(editingNote.id, noteData);
      setEditingNote(null);
      await loadNotes();
    } catch (error: any) {
      console.error('Error updating note:', error);
      setError(`Error al actualizar nota: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) return;
    
    setLoading(true);
    setError('');
    try {
      await deleteNote(noteId);
      await loadNotes();
    } catch (error: any) {
      console.error('Error deleting note:', error);
      setError(`Error al eliminar nota: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mis Notas</h1>
            <p className="text-gray-600">Bienvenido, {user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulario */}
        {editingNote ? (
          <NoteForm
            onSubmit={handleUpdateNote}
            onCancel={handleCancelEdit}
            initialData={editingNote}
            loading={formLoading}
          />
        ) : (
          <NoteForm
            onSubmit={handleCreateNote}
            loading={formLoading}
          />
        )}

        {/* Lista de Notas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tus Notas ({notes.length})</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando notas...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No tienes notas aún. ¡Crea tu primera nota!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesDashboard;