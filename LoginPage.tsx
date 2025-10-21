
import React, { useState, FC } from 'react';

interface LoginPageProps {
  onLogin: (nombre: string, contrasena: string) => void;
  onNavigateToRegister: () => void;
}

const LoginPage: FC<LoginPageProps> = ({ onLogin, onNavigateToRegister }) => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(nombre, contrasena);
  };

  const formInputStyle = "w-full p-3 text-[#333333] bg-white border border-[#E0E0E0] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-[#333333] mb-2">Nombre de Usuario</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              className={formInputStyle} 
              required 
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-[#333333] mb-2">Contraseña</label>
            <input 
              type="password" 
              value={contrasena} 
              onChange={e => setContrasena(e.target.value)} 
              className={formInputStyle} 
              required 
            />
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white font-bold rounded-lg hover:shadow-lg transition-shadow text-lg"
            >
              Entrar
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
            <p className="text-[#555555]">
                ¿No tienes una cuenta?{' '}
                <button onClick={onNavigateToRegister} className="font-bold text-[#FF6B6B] hover:underline">
                    Regístrate aquí
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
