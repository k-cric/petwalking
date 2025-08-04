export interface Post {
  id: string;
  username: string;
  imageUrl: string;
  caption: string;
  createdAt: any;
  userId: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: any;
}

export interface User {
  uid: string;
  username: string;
  email: string;
  photoURL?: string;
  bio?: string;
}

export interface Like {
  userId: string;
  createdAt: any;
} 