
export enum Category {
  EBOOKS = 'E-books',
  COURSES = 'Courses',
  VIDEO_ASSETS = 'Video Assets',
  GRAPHICS = 'Graphics',
  DEVELOPMENT = 'Development',
  OTHER = 'Other'
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  duration: string;
  content?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  additionalImages?: string[]; // Multiple images support
  fileUrl: string; // The "download" link
  fileType: string;
  fileSize: string;
  isFree: boolean;
  modules?: CourseModule[]; // Only for Courses
  rating: number;
  salesCount: number; // Also used as download count
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  purchasedIds: string[];
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface ProductRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  userName: string;
  date: string;
  status: 'pending' | 'reviewed' | 'fulfilled';
}