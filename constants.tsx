
import { Product, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Mastering React 18',
    description: 'The complete guide to modern frontend development with React, Hooks, and Advanced patterns.',
    price: 49.99,
    category: Category.COURSES,
    imageUrl: 'https://picsum.photos/seed/react/800/600',
    fileUrl: '#',
    fileType: 'MP4 / Source Code',
    fileSize: '4.2 GB',
    isFree: false,
    rating: 4.8,
    salesCount: 1250,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Introduction',
        lessons: [
          { id: 'l1', title: 'Why React?', duration: '10:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l2', title: 'Setup Environment', duration: '15:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Cinematic LUTs Pack',
    description: '15 premium LUTs for professional video color grading in Premiere Pro and Resolve.',
    price: 19.00,
    category: Category.VIDEO_ASSETS,
    imageUrl: 'https://picsum.photos/seed/video/800/600',
    fileUrl: '#',
    fileType: 'ZIP / .cube',
    fileSize: '125 MB',
    isFree: false,
    rating: 4.5,
    salesCount: 840,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'UI Design Fundamentals',
    description: 'Learn the core principles of UI design for web and mobile applications.',
    price: 0,
    category: Category.EBOOKS,
    imageUrl: 'https://picsum.photos/seed/design/800/600',
    fileUrl: '#',
    fileType: 'PDF',
    fileSize: '12 MB',
    isFree: true,
    rating: 4.9,
    salesCount: 3500,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Abstract Backgrounds Vol 1',
    description: 'A collection of high-resolution 4K abstract backgrounds for your design projects.',
    price: 9.99,
    category: Category.GRAPHICS,
    imageUrl: 'https://picsum.photos/seed/abstract/800/600',
    fileUrl: '#',
    fileType: 'JPG / PNG',
    fileSize: '450 MB',
    isFree: false,
    rating: 4.2,
    salesCount: 210,
    createdAt: new Date().toISOString(),
  }
];
