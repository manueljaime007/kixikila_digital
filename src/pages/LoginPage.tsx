import { useNavigate } from 'react-router-dom';
import { User, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = (e.target as any).identifier.value;
    const password = (e.target as any).password.value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        alert(data.error || 'Erro ao entrar');
      }
    } catch {
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2ED]">
      <div className="p-8 pt-12 flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white rounded-full shadow-sm border border-black/5"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-[#F23030] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-[#1A1A1A] mb-2 leading-tight text-center">
            Bem-vindo à nossa Banda!
          </h1>
          <p className="text-slate-500 font-medium text-center">
            Preenche os teus dados para entrar na tua conta.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
              Email ou Telemóvel
            </label>
            <input
              name="identifier"
              type="text"
              required
              className="w-full text-lg font-bold focus:outline-none no-animation-input"
              placeholder="ex: 923 000 000"
            />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
              Palavra-passe
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full text-lg font-bold focus:outline-none no-animation-input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full btn-primary">
            LOGIN
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-slate-500">
          Ainda não é Mano?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-[#F23030] font-black hover:underline"
          >
            Cadastrar aqui
          </button>
        </p>
      </div>

      <div className="h-2 flex">
        <div className="flex-1 bg-[#F23030]"></div>
        <div className="flex-1 bg-[#D9A441]"></div>
        <div className="flex-1 bg-[#1A1A1A]"></div>
      </div>
    </div>
  );
};