import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, PlusCircle, Book, ArrowUpRight, Building2, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AppRoutes } from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const PUBLIC_ROUTES = ['/', '/terms', '/login', '/signup'];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const showNav = !PUBLIC_ROUTES.includes(location.pathname);

  const navItems = [
    { path: '/dashboard', label: 'Início', icon: <Home size={22} /> },
    { path: '/groups', label: 'Grupos da Banda', icon: <Users size={22} /> },
    { path: '/create-group', label: 'Criar Kixikila', icon: <PlusCircle size={22} /> },
    { path: '/notes', label: 'Meu Caderno', icon: <Book size={22} /> },
    { path: '/withdraw', label: 'Levantar Saque', icon: <ArrowUpRight size={22} /> },
    { path: '/corporate', label: 'Corporativo', icon: <Building2 size={22} /> },
    { path: '/settings', label: 'Configurações', icon: <SettingsIcon size={22} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      <div className={cn(showNav ? 'lg:pl-72' : '')}>
        <AppRoutes />
      </div>

      {showNav && (
        <>
          {/* mobile bottom nav */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-black/5 px-8 py-4 flex justify-between items-center z-40 lg:hidden rounded-t-[40px] shadow-2xl">
            <button onClick={() => navigate('/dashboard')} className={cn('p-2 flex flex-col items-center gap-1', location.pathname === '/dashboard' ? 'text-[#F23030]' : 'text-slate-300')}>
              <Home size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">Início</span>
            </button>
            <button onClick={() => navigate('/groups')} className={cn('p-2 flex flex-col items-center gap-1', location.pathname === '/groups' ? 'text-[#F23030]' : 'text-slate-300')}>
              <Users size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">Grupos</span>
            </button>
            <button onClick={() => navigate('/create-group')} className="w-14 h-14 bg-[#F23030] text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center -mt-12 border-4 border-[#F5F2ED] active:scale-90 transition-transform">
              <PlusCircle size={32} />
            </button>
            <button onClick={() => navigate('/notes')} className={cn('p-2 flex flex-col items-center gap-1', location.pathname === '/notes' ? 'text-[#F23030]' : 'text-slate-300')}>
              <Book size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">Caderno</span>
            </button>
            <button onClick={() => navigate('/withdraw')} className={cn('p-2 flex flex-col items-center gap-1', location.pathname === '/withdraw' ? 'text-[#F23030]' : 'text-slate-300')}>
              <ArrowUpRight size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">Saque</span>
            </button>
          </nav>

          {/* desktop sidebar */}
          <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-black/5 flex-col p-8 z-40">
            <div className="mb-12">
              <h1 className="text-2xl font-black tracking-tighter">KIXIKILA<span className="text-[#F23030]">.</span></h1>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Digital Banda</p>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all',
                    location.pathname === item.path
                      ? 'bg-[#F23030] text-white shadow-lg shadow-red-500/20'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-[#1A1A1A]'
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pt-8 border-t border-black/5">
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-[#F23030] transition-all"
              >
                <LogOut size={22} />
                Sair da Banda
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}