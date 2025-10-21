
export interface Ingredient {
  id: string;
  quantity: string;
  unit: string;
  name: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  steps: string[];
  creator: string;
  createdAt: string; 
}

export type View =
  | { page: 'home' }
  | { page: 'detail'; recipeId: string }
  | { page: 'form'; recipeId?: string }
  | { page: 'profile'; creatorName: string }
  | { page: 'login' }
  | { page: 'register' };
