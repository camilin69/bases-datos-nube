// src/components/NoteItem.tsx
import type { Note } from '../types/Note';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  loading?: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete, loading = false }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Fecha no disponible';
    
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{note.title}</h3>
      
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
      
      <div className="text-sm text-gray-500 mb-4">
        <p>Creado: {formatDate(note.createdAt)}</p>
        {note.updatedAt && note.updatedAt !== note.createdAt && (
          <p>Actualizado: {formatDate(note.updatedAt)}</p>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(note)}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
        >
          Editar
        </button>
        
        <button
          onClick={() => onDelete(note.id!)}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default NoteItem;