import React, { useState, useMemo, FC, useRef, useEffect } from 'react';
import type { Recipe, Ingredient, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialRecipes } from './data/initialData';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

// --- API MOCK ---
// Simula la API del backend. En un futuro, esto hará llamadas `fetch` reales.
const api = {
  getRecipes: async (): Promise<Recipe[]> => {
    console.log("API: Obteniendo todas las recetas.");
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    return recipes;
  },
  login: async (nombre: string, contrasena: string): Promise<string | null> => {
    console.log(`API: Intentando iniciar sesión como ${nombre}`);
    // En un backend real, aquí validarías contra la base de datos.
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[nombre] && users[nombre] === contrasena) {
      console.log("API: Inicio de sesión exitoso.");
      return nombre;
    }
    console.log("API: Credenciales incorrectas.");
    return null;
  },
  register: async (nombre: string, contrasena: string): Promise<string | null> => {
    console.log(`API: Intentando registrar a ${nombre}`);
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[nombre]) {
      console.log("API: El usuario ya existe.");
      return null;
    }
    users[nombre] = contrasena; // En un backend real, hashearías la contraseña.
    localStorage.setItem('users', JSON.stringify(users));
    console.log("API: Registro exitoso.");
    return nombre;
  },
  saveRecipe: async (recipeData: Omit<Recipe, 'id' | 'createdAt'> & { id?: string }, user: string): Promise<Recipe> => {
    console.log("API: Guardando receta...");
    let recipes: Recipe[] = JSON.parse(localStorage.getItem('recipes') || '[]');
    if (recipeData.id) { // Update
      const updatedRecipe = { ...recipes.find(r => r.id === recipeData.id)!, ...recipeData, creator: user };
      recipes = recipes.map(r => r.id === recipeData.id ? updatedRecipe : r);
      localStorage.setItem('recipes', JSON.stringify(recipes));
      return updatedRecipe;
    } else { // Create
      const newRecipe: Recipe = {
        ...recipeData,
        id: crypto.randomUUID(),
        creator: user,
        createdAt: new Date().toISOString()
      };
      recipes = [newRecipe, ...recipes];
      localStorage.setItem('recipes', JSON.stringify(recipes));
      return newRecipe;
    }
  },
  deleteRecipe: async (id: string): Promise<void> => {
      console.log(`API: Eliminando receta ${id}`);
      let recipes: Recipe[] = JSON.parse(localStorage.getItem('recipes') || '[]');
      recipes = recipes.filter(r => r.id !== id);
      localStorage.setItem('recipes', JSON.stringify(recipes));
  }
};


// --- ICONS ---
const PlusIcon: FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> );
const BackIcon: FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> );
const TrashIcon: FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> );
const PencilIcon: FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg> );
const UserIcon: FC<{ className?: string }> = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> );
const LogoutIcon: FC<{ className?: string }> = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> );


const ClockIcon: FC<{ className?: string }> = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg> );

// --- HELPERS ---
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "hace un momento";
    if (minutes < 60) return `hace ${minutes} min`;
    if (hours < 24) return `hace ${hours} h`;
    if (days === 1) return "ayer";
    if (days < 7) return `hace ${days} días`;
    
    return `el ${date.toLocaleDateString()}`;
}


// --- UI COMPONENTS ---

interface UserMenuProps {
    currentUser: string;
    onLogout: () => void;
}
const UserMenu: FC<UserMenuProps> = ({ currentUser, onLogout }) => {
    return (
        <div className="relative">
            <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                title="Cerrar Sesión"
            >
                <span className="font-semibold text-sm hidden md:inline">{currentUser}</span>
                <LogoutIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

interface HeaderProps {
    currentUser: string | null;
    onLogout: () => void;
    onNavigateToLogin: () => void;
}
const Header: FC<HeaderProps> = ({ currentUser, onLogout, onNavigateToLogin }) => (
  <header className="bg-[#2C3E50] shadow-md sticky top-0 z-10">
    <div className="max-w-6xl mx-auto py-2 px-4 flex justify-between items-center">
      <div className="w-24"></div>
      <h1 className="text-xl md:text-2xl text-white font-bold text-center tracking-wider cursor-pointer" onClick={() => window.location.reload()}>Recetario Colaborativo</h1>
      <div className="w-24 flex justify-end">
        {currentUser ? (
            <UserMenu currentUser={currentUser} onLogout={onLogout} />
        ) : (
            <button onClick={onNavigateToLogin} className="flex items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                <UserIcon className="h-6 w-6" />
                <span className="font-semibold text-sm">Iniciar Sesión</span>
            </button>
        )}
      </div>
    </div>
  </header>
);

// ... (Other components like SearchBar, RecipeCard, FloatingActionButton remain mostly the same)
interface SearchBarProps { searchTerm: string; setSearchTerm: (term: string) => void; }
const SearchBar: FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => ( <div className="my-8"><input type="text" placeholder="Buscar por nombre o ingrediente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-2xl mx-auto block p-4 text-lg text-[#333333] bg-white border border-[#E0E0E0] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all" /></div> );
interface RecipeCardProps { recipe: Recipe; onSelect: (id: string) => void; onSelectCreator: (name: string) => void; }
const RecipeCard: FC<RecipeCardProps> = ({ recipe, onSelect, onSelectCreator }) => ( <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col" onClick={() => onSelect(recipe.id)}> <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover" /> <div className="p-5 flex flex-col flex-grow"> <h3 className="text-xl font-bold text-[#2C3E50] mb-2">{recipe.name}</h3> <p className="text-[#555555] text-sm flex-grow mb-4">{recipe.description.substring(0, 100)}...</p> <div className="mt-auto border-t border-gray-100 pt-3"> <p className="text-[#B0B0B0] font-bold uppercase text-xs self-start hover:text-[#FF6B6B] transition-colors" onClick={(e) => { e.stopPropagation(); onSelectCreator(recipe.creator); }}>Por: {recipe.creator}</p> <div className="flex items-center text-xs text-gray-400 mt-1"> <ClockIcon className="h-4 w-4 mr-1" /> <span>{formatRelativeTime(recipe.createdAt)}</span> </div> </div> </div> </div> );
interface FloatingActionButtonProps { onClick: () => void; }
const FloatingActionButton: FC<FloatingActionButtonProps> = ({ onClick }) => ( <button onClick={onClick} className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transform transition-all duration-300 z-20" aria-label="Añadir nueva receta"><PlusIcon /></button> );


// --- PAGE COMPONENTS ---

interface HomePageProps { recipes: Recipe[]; searchTerm: string; setSearchTerm: (term: string) => void; onSelectRecipe: (id: string) => void; onAddRecipe: () => void; onSelectCreator: (name: string) => void; isLoggedIn: boolean; }
const HomePage: FC<HomePageProps> = ({ recipes, searchTerm, setSearchTerm, onSelectRecipe, onAddRecipe, onSelectCreator, isLoggedIn }) => ( <> <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {recipes.length > 0 ? ( recipes.map(recipe => ( <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} onSelectCreator={onSelectCreator} /> )) ) : ( <p className="text-[#555555] col-span-full text-center">No se encontraron recetas. ¡Intenta con otra búsqueda!</p> )} </div> {isLoggedIn && <FloatingActionButton onClick={onAddRecipe} />} </> );
interface RecipeDetailPageProps { recipe: Recipe; currentUser: string | null; onBack: () => void; onEdit: (id: string) => void; onDelete: (id: string) => void; onSelectCreator: (name: string) => void; }
const RecipeDetailPage: FC<RecipeDetailPageProps> = ({ recipe, currentUser, onBack, onEdit, onDelete, onSelectCreator }) => ( <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-4xl mx-auto animate-fade-in"> <button onClick={onBack} className="flex items-center text-[#FF6B6B] font-bold mb-6 hover:underline"><BackIcon />Volver a todas las recetas</button> <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-96 object-cover rounded-lg mb-6"/> <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">{recipe.name}</h1> <div className="text-sm text-[#B0B0B0] mb-6 flex space-x-4"> <span className="font-bold uppercase hover:text-[#FF6B6B] transition-colors cursor-pointer" onClick={() => onSelectCreator(recipe.creator)}>Por: {recipe.creator}</span> <span>Publicado el: {new Date(recipe.createdAt).toLocaleDateString()}</span> </div> {currentUser === recipe.creator && ( <div className="flex space-x-4 mb-8"> <button onClick={() => onEdit(recipe.id)} className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"><PencilIcon /> Editar</button> <button onClick={() => onDelete(recipe.id)} className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"><TrashIcon /> Eliminar</button> </div> )} <p className="text-[#555555] text-lg mb-8">{recipe.description}</p> <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> <div className="md:col-span-1"> <h2 className="text-2xl font-bold text-[#2C3E50] border-b-2 border-[#FF6B6B] pb-2 mb-4">Ingredientes</h2> <ul className="list-disc list-inside space-y-2 text-[#333333]"> {recipe.ingredients.map(ing => ( <li key={ing.id}>{ing.quantity} {ing.unit} {ing.name}</li> ))} </ul> </div> <div className="md:col-span-2"> <h2 className="text-2xl font-bold text-[#2C3E50] border-b-2 border-[#FF6B6B] pb-2 mb-4">Preparación</h2> <ol className="list-decimal list-inside space-y-4 text-[#333333]"> {recipe.steps.map((step, index) => ( <li key={index} className="pl-2">{step}</li> ))} </ol> </div> </div> </div> );
interface RecipeFormPageProps { initialRecipe?: Recipe; onSave: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'creator'> & { id?: string }) => void; onCancel: () => void; }
const RecipeFormPage: FC<RecipeFormPageProps> = ({ initialRecipe, onSave, onCancel }) => {
  const [name, setName] = useState(initialRecipe?.name || '');
  const [description, setDescription] = useState(initialRecipe?.description || '');
  const [imageUrl, setImageUrl] = useState(initialRecipe?.imageUrl || '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialRecipe?.ingredients || [{ id: crypto.randomUUID(), quantity: '', unit: '', name: '' }]);
  const [steps, setSteps] = useState<string[]>(initialRecipe?.steps || ['']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImageUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = <K extends keyof Omit<Ingredient, 'id'>>(index: number, field: K, value: string) => { const newIngredients = [...ingredients]; newIngredients[index][field] = value; setIngredients(newIngredients); };
  const addIngredient = () => setIngredients([...ingredients, { id: crypto.randomUUID(), quantity: '', unit: '', name: '' }]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const handleStepChange = (index: number, value: string) => { const newSteps = [...steps]; newSteps[index] = value; setSteps(newSteps); };
  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) { alert("Por favor, añade una imagen para la receta."); return; }
    onSave({ id: initialRecipe?.id, name, description, imageUrl, ingredients, steps });
  };

  const formInputStyle = "w-full p-3 text-[#333333] bg-white border border-[#E0E0E0] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all";

  return (
    <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">{initialRecipe ? 'Editar Receta' : 'Crear Nueva Receta'}</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div> <label className="block text-lg font-bold text-[#333333] mb-2">Nombre de la Receta</label> <input type="text" value={name} onChange={e => setName(e.target.value)} className={formInputStyle} required /> </div>
        <div> <label className="block text-lg font-bold text-[#333333] mb-2">Descripción</label> <textarea value={description} onChange={e => setDescription(e.target.value)} className={formInputStyle} rows={4} required /> </div>
        <div>
            <label className="block text-lg font-bold text-[#333333] mb-2">Imagen de la Receta</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                    {imageUrl ? ( <img src={imageUrl} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-cover"/> ) : ( <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12A2.25 2.25 0 0120.25 20.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg> )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-[#FF6B6B] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#FF8E53] focus-within:ring-offset-2 hover:text-[#FF8E53]">
                            <span>Sube un archivo</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" ref={fileInputRef} />
                        </label>
                        <p className="pl-1">o pega una URL</p>
                    </div>
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={`${formInputStyle} mt-4 text-xs`} placeholder="https://ejemplo.com/imagen.jpg" />
                </div>
            </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#333333] mb-4">Ingredientes</h2>
          {ingredients.map((ing, index) => ( <div key={ing.id} className="flex items-center space-x-2 mb-3"> <input type="text" placeholder="Cant." value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', e.target.value)} className={`${formInputStyle} w-1/5`} /> <input type="text" placeholder="Unidad" value={ing.unit} onChange={e => handleIngredientChange(index, 'unit', e.target.value)} className={`${formInputStyle} w-1/5`} /> <input type="text" placeholder="Nombre del ingrediente" value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} className={`${formInputStyle} w-3/5`} required/> <button type="button" onClick={() => removeIngredient(index)} className="p-2 text-red-500 hover:text-red-700">&times;</button> </div> ))}
          <button type="button" onClick={addIngredient} className="mt-2 px-4 py-2 text-sm text-white bg-[#FF6B6B] rounded-lg hover:bg-opacity-90">Añadir Ingrediente</button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#333333] mb-4">Pasos de Preparación</h2>
          {steps.map((step, index) => ( <div key={index} className="flex items-center space-x-2 mb-3"> <textarea value={step} onChange={e => handleStepChange(index, e.target.value)} className={formInputStyle} rows={2} required/> <button type="button" onClick={() => removeStep(index)} className="p-2 text-red-500 hover:text-red-700">&times;</button> </div> ))}
          <button type="button" onClick={addStep} className="mt-2 px-4 py-2 text-sm text-white bg-[#FF6B6B] rounded-lg hover:bg-opacity-90">Añadir Paso</button>
        </div>
        <div className="flex justify-end space-x-4 pt-4"> <button type="button" onClick={onCancel} className="px-6 py-3 bg-gray-200 text-[#555555] font-bold rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button> <button type="submit" className="px-6 py-3 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white font-bold rounded-lg hover:shadow-lg transition-shadow">Guardar Receta</button> </div>
      </form>
    </div>
  );
};
interface UserProfilePageProps { creatorName: string; recipes: Recipe[]; onSelectRecipe: (id: string) => void; onBack: () => void; onSelectCreator: (name: string) => void; }
const UserProfilePage: FC<UserProfilePageProps> = ({ creatorName, recipes, onSelectRecipe, onBack, onSelectCreator }) => { return ( <div className="animate-fade-in"> <button onClick={onBack} className="flex items-center text-[#FF6B6B] font-bold mb-6 hover:underline"><BackIcon />Volver a todas las recetas</button> <div className="text-center mb-10"> <h1 className="text-4xl font-bold text-[#2C3E50]">{creatorName}</h1> <p className="text-lg text-[#555555] mt-2">{recipes.length} {recipes.length === 1 ? 'receta compartida' : 'recetas compartidas'}</p> </div> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {recipes.map(recipe => ( <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} onSelectCreator={onSelectCreator} /> ))} </div> </div> ); };


// --- MAIN APP COMPONENT ---

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);
  const [view, setView] = useState<View>({ page: 'home' });
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
        // Si no hay recetas en localStorage, carga las iniciales.
        if (!localStorage.getItem('recipes')) {
            localStorage.setItem('recipes', JSON.stringify(initialRecipes));
        }
        // Si no hay usuarios, crea un objeto vacío.
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify({}));
        }
        const fetchedRecipes = await api.getRecipes();
        setRecipes(fetchedRecipes);
    };
    loadData();
  }, []);

  const filteredRecipes = useMemo(() => {
    if (!searchTerm) return recipes;
    const lowercasedFilter = searchTerm.toLowerCase();
    return recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowercasedFilter) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowercasedFilter))
    );
  }, [recipes, searchTerm]);

  const handleRegister = async (nombre: string, contrasena: string) => {
    const user = await api.register(nombre, contrasena);
    if (user) {
      setCurrentUser(user);
      setView({ page: 'home' });
    } else {
      alert("El registro falló. El usuario puede que ya exista.");
    }
  };

  const handleLogin = async (nombre: string, contrasena: string) => {
    const user = await api.login(nombre, contrasena);
    if (user) {
      setCurrentUser(user);
      setView({ page: 'home' });
    } else {
      alert("Inicio de sesión fallido. Revisa tus credenciales.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView({ page: 'login' });
  };

  const handleSaveRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'creator'> & { id?: string }) => {
    if (!currentUser) {
        alert("Debes iniciar sesión para guardar una receta.");
        setView({ page: 'login' });
        return;
    }
    const savedRecipe = await api.saveRecipe(recipeData, currentUser);
    const updatedRecipes = await api.getRecipes();
    setRecipes(updatedRecipes);
    setView({ page: 'detail', recipeId: savedRecipe.id });
  };

  const handleDeleteRecipe = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta receta?")) {
      await api.deleteRecipe(id);
      const updatedRecipes = await api.getRecipes();
      setRecipes(updatedRecipes);
      setView({ page: 'home' });
    }
  };

  const renderContent = () => {
    if (!currentUser && view.page !== 'login' && view.page !== 'register') {
        setView({ page: 'login' });
    }
      
    switch (view.page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setView({ page: 'register' })} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setView({ page: 'login' })} />;
      case 'detail':
        const recipe = recipes.find(r => r.id === view.recipeId);
        return recipe ? <RecipeDetailPage recipe={recipe} currentUser={currentUser} onBack={() => setView({ page: 'home' })} onEdit={(id) => setView({ page: 'form', recipeId: id })} onDelete={handleDeleteRecipe} onSelectCreator={(name) => setView({ page: 'profile', creatorName: name})} /> : <div>Receta no encontrada</div>;
      case 'form':
        if (!currentUser) {
            return <div>Acceso Denegado</div>; // No debería llegar aquí
        }
        const recipeToEdit = recipes.find(r => r.id === view.recipeId);
        if (recipeToEdit && recipeToEdit.creator !== currentUser) {
             return <div>No tienes permiso para editar esta receta.</div>;
        }
        return <RecipeFormPage initialRecipe={recipeToEdit} onSave={handleSaveRecipe} onCancel={() => view.recipeId ? setView({ page: 'detail', recipeId: view.recipeId }) : setView({ page: 'home' })} />;
      case 'profile':
          const userRecipes = recipes.filter(r => r.creator === view.creatorName);
          return <UserProfilePage creatorName={view.creatorName} recipes={userRecipes} onSelectRecipe={(id) => setView({ page: 'detail', recipeId: id })} onBack={() => setView({ page: 'home' })} onSelectCreator={(name) => setView({ page: 'profile', creatorName: name})} />
      case 'home':
      default:
        return <HomePage recipes={filteredRecipes} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSelectRecipe={(id) => setView({ page: 'detail', recipeId: id })} onAddRecipe={() => setView({ page: 'form' })} onSelectCreator={(name) => setView({ page: 'profile', creatorName: name})} isLoggedIn={!!currentUser} />;
    }
  };

  return (
    <div className="min-h-screen text-[#333333]">
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateToLogin={() => setView({ page: 'login' })}
      />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}