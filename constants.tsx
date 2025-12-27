import { Product, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    title: 'CyberCity 2077 - 3D Kit',
    description: 'A massive collection of over 200 high-fidelity 3D assets optimized for Unreal Engine 5.',
    price: 49.99,
    category: Category.GRAPHICS,
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
    fileUrl: '#',
    fileType: 'ZIP',
    fileSize: '4.2 GB',
    isFree: false,
    badgeText: 'BEST SELLER',
    rating: 4.9,
    salesCount: 1240,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'Mastering React: Pro Edition',
    description: 'Learn advanced patterns and state management in this 40-hour masterclass.',
    price: 129.00,
    category: Category.COURSES,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    fileUrl: '#',
    fileType: 'MP4',
    fileSize: '12 GB',
    isFree: false,
    badgeText: 'HOT',
    rating: 5.0,
    salesCount: 850,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-3',
    title: 'Nova UI Design System',
    description: 'A comprehensive Figma design system for modern digital products.',
    price: 0,
    category: Category.DEVELOPMENT,
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop',
    fileUrl: '#',
    fileType: 'FIGMA',
    fileSize: '150 MB',
    isFree: true,
    badgeText: 'FREE',
    rating: 4.8,
    salesCount: 5200,
    createdAt: new Date().toISOString()
  }
];