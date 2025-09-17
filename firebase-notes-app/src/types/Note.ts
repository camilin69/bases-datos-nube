// src/types/Note.ts
export interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt: any;
  updatedAt: any;
  userId: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: any;
}