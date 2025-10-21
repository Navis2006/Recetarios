
import type { Recipe } from '../types';

export const initialRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Tacos al Pastor',
    description: 'Una deliciosa receta tradicional mexicana con cerdo marinado y piña. Perfecta para una cena con amigos.',
    imageUrl: 'https://picsum.photos/seed/tacos/600/400',
    ingredients: [
      { id: 'i1-1', quantity: '1', unit: 'kg', name: 'de lomo de cerdo' },
      { id: 'i1-2', quantity: '1', unit: 'taza', name: 'de jugo de piña' },
      { id: 'i1-3', quantity: '2', unit: 'chiles', name: 'guajillo' },
      { id: 'i1-4', quantity: '1/4', unit: 'taza', name: 'de vinagre blanco' },
    ],
    steps: [
      'Marinar el cerdo en la mezcla de chiles, jugo de piña y vinagre por al menos 4 horas.',
      'Cortar la carne en trozos pequeños y cocinar en un sartén caliente.',
      'Servir en tortillas de maíz calientes con cilantro, cebolla y trozos de piña.',
    ],
    creator: 'Ana_Cocina',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    name: 'Pasta Carbonara Auténtica',
    description: 'La clásica pasta italiana sin crema, solo con huevo, queso pecorino, guanciale y pimienta negra.',
    imageUrl: 'https://picsum.photos/seed/pasta/600/400',
    ingredients: [
      { id: 'i2-1', quantity: '400', unit: 'g', name: 'de spaghetti' },
      { id: 'i2-2', quantity: '150', unit: 'g', name: 'de guanciale' },
      { id: 'i2-3', quantity: '4', unit: '', name: 'yemas de huevo' },
      { id: 'i2-4', quantity: '50', unit: 'g', name: 'de queso Pecorino Romano' },
    ],
    steps: [
      'Cocinar la pasta según las instrucciones del paquete.',
      'Mientras tanto, freír el guanciale hasta que esté crujiente.',
      'Mezclar las yemas con el queso y pimienta. Añadir la pasta caliente y el guanciale, mezclando rápidamente para crear una salsa cremosa.',
      'Servir inmediatamente con más queso rallado.',
    ],
    creator: 'Marco_Italiano',
    createdAt: new Date('2023-10-25T12:30:00Z').toISOString(),
  },
  {
    id: '3',
    name: 'Ensalada Griega Refrescante',
    description: 'Una ensalada vibrante y saludable, llena de sabores mediterráneos. Ideal para un almuerzo ligero.',
    imageUrl: 'https://picsum.photos/seed/salad/600/400',
    ingredients: [
      { id: 'i3-1', quantity: '1', unit: '', name: 'pepino grande' },
      { id: 'i3-2', quantity: '4', unit: '', name: 'tomates maduros' },
      { id: 'i3-3', quantity: '1', unit: '', name: 'pimiento verde' },
      { id: 'i3-4', quantity: '200', unit: 'g', name: 'de queso feta' },
      { id: 'i3-5', quantity: '1', unit: 'puñado', name: 'de aceitunas Kalamata' },
    ],
    steps: [
      'Cortar todas las verduras en trozos grandes y mezclar en un bol.',
      'Añadir el queso feta en cubos y las aceitunas.',
      'Aliñar con aceite de oliva virgen extra, orégano seco, sal y pimienta al gusto.',
      'Mezclar suavemente y servir fría.',
    ],
    creator: 'Chef_React',
    createdAt: new Date('2023-10-24T09:00:00Z').toISOString(),
  },
];
