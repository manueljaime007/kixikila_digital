import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Bell, Shield, LogOut, ChevronRight, Camera, CheckCircle2, X, Smartphone, Globe, HelpCircle } from 'lucide-react';
import { type User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
}

export const Settings = ({ user, onLogout, onBack }: SettingsProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(false);
  };

  const SettingItem = ({ icon: Icon, label, value, onClick, color = "text-slate-400" }: any) => (
    <button 
      onClick={onClick}
      className="w-full p-5 bg-white rounded-3xl border border-black/5 flex items-center justify-between group active:scale-[0.98] transition-all mb-3"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${color}`}>
          <Icon size={22} />
        </div>
        <div className="text-left">
          <p className="font-black text-sm text-[#1A1A1A]">{label}</p>
          {value && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{value}</p>}
        </div>
      </div>
      <ChevronRight className="text-slate-200 group-hover:text-[#F23030] transition-colors" size={20} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <header className="bg-white p-6 border-b border-black/5 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full">
          <X size={20} />
        </button>
        <h2 className="font-black text-xl">Configurações</h2>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Profile Card */}
        <section className="flex flex-col items-center">
          <div className="relative mb-4 group">
            <div className="w-32 h-32 rounded-[40px] bg-white border-4 border-[#D9A441] flex items-center justify-center overflow-hidden shadow-xl">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={48} className="text-[#D9A441]" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#F23030] text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#F5F2ED] active:scale-90 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          <h3 className="text-2xl font-black text-[#1A1A1A]">{user.name}</h3>
          <p className="text-sm font-bold text-slate-400">{user.email}</p>
          <span className="mt-2 px-4 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full border border-emerald-100">
            Conta Verificada
          </span>
        </section>

        {/* Settings Groups */}
        <section>
          <h4 className="text-[10px] font-black text-[#F23030] uppercase tracking-[0.2em] mb-4 ml-2">Conta e Perfil</h4>
          <SettingItem icon={User} label="Editar Perfil" value="Nome, Email, Telemóvel" onClick={() => setIsEditingProfile(true)} />
          <SettingItem icon={Lock} label="Mudar Senha" value="Segurança da Conta" onClick={() => setIsChangingPassword(true)} />
          <SettingItem icon={Shield} label="Privacidade" value="Dados e Permissões" />
        </section>

        <section>
          <h4 className="text-[10px] font-black text-[#F23030] uppercase tracking-[0.2em] mb-4 ml-2">Preferências</h4>
          <SettingItem icon={Bell} label="Notificações" value="Alertas de Pagamento" />
          <SettingItem icon={Smartphone} label="Dispositivos" value="Sessões Activas" />
          <SettingItem icon={Globe} label="Idioma" value="Português (Angola)" />
        </section>

        <section>
          <h4 className="text-[10px] font-black text-[#F23030] uppercase tracking-[0.2em] mb-4 ml-2">Suporte</h4>
          <SettingItem icon={HelpCircle} label="Centro de Ajuda" value="Dúvidas e Tutoriais" />
          <button 
            onClick={onLogout}
            className="w-full p-5 bg-red-50 rounded-3xl border border-red-100 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-sm">
                <LogOut size={22} />
              </div>
              <div className="text-left">
                <p className="font-black text-sm text-red-600">Terminar Sessão</p>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Sair da Banda</p>
              </div>
            </div>
            <ChevronRight className="text-red-200 group-hover:text-red-500 transition-colors" size={20} />
          </button>
        </section>

        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest pt-8">
          Kixikila Digital v2.4.0 • Luanda, AO
        </p>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[40px] w-full max-w-md p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Editar Perfil</h3>
                <button onClick={() => setIsEditingProfile(false)} className="p-2 bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold focus:outline-none" 
                  />
                </div>
                <button type="submit" className="w-full btn-primary mt-4">
                  GUARDAR ALTERAÇÕES
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isChangingPassword && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[40px] w-full max-w-md p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Mudar Senha</h3>
                <button onClick={() => setIsChangingPassword(false)} className="p-2 bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Senha Actual</label>
                  <input type="password" required className="w-full bg-slate-50 p-4 rounded-2xl font-bold focus:outline-none" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Nova Senha</label>
                  <input type="password" required className="w-full bg-slate-50 p-4 rounded-2xl font-bold focus:outline-none" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Confirmar Nova Senha</label>
                  <input type="password" required className="w-full bg-slate-50 p-4 rounded-2xl font-bold focus:outline-none" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full btn-primary mt-4">
                  ACTUALIZAR SENHA
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
