import React from 'react';
import { Wallet, Users, ArrowUpRight, PlusCircle, CreditCard, Bell, ChevronRight, Smartphone, Book, Building2, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { type User, type AppScreen } from '../types';

interface DashboardProps {
  user: User;
  setScreen: (screen: AppScreen) => void;
}

export const Dashboard = ({ user, setScreen }: DashboardProps) => {
  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-30 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setScreen('SETTINGS')}
            className="w-12 h-12 rounded-full bg-[#F5F2ED] border-2 border-[#D9A441] flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
          >
            <UserIcon className="text-[#D9A441]" size={24} />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Olá, Mano!</p>
            <p className="text-lg font-black text-[#1A1A1A]">Bem-vindo de volta</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-12 h-12 bg-white rounded-full shadow-sm border border-black/5 flex items-center justify-center text-slate-400 hover:text-[#F23030] transition-colors">
            <Bell size={22} />
          </button>
          <button 
            onClick={() => setScreen('SETTINGS')}
            className="w-12 h-12 bg-white rounded-full shadow-sm border border-black/5 flex items-center justify-center text-slate-400 hover:text-[#D9A441] transition-colors"
          >
            <SettingsIcon size={22} />
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Balance Card */}
        <div className="bg-[#D9A441] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-[#1A1A1A] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Saldo da Banda</p>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet size={20} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 md:mb-8">Kz {user.balance.toLocaleString('pt-AO')}</h2>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#D9A441] bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100`} alt="user" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#D9A441] bg-white flex items-center justify-center text-[8px] md:text-[10px] font-black">
                  +12
                </div>
              </div>
              <button 
                onClick={() => setScreen('DEPOSIT')}
                className="bg-[#1A1A1A] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-black transition-all"
              >
                Detalhes <ChevronRight size={14} />
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Actions */}
        <section>
          <h3 className="text-xl font-black text-[#1A1A1A] mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button 
              onClick={() => setScreen('GROUPS')}
              className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-black/5 flex flex-col items-center gap-3 md:gap-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-50 text-[#F23030] flex items-center justify-center">
                <Users size={24} />
              </div>
              <div className="text-center">
                <p className="font-black text-sm text-[#1A1A1A]">Entrar</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">No Grupo</p>
              </div>
            </button>

            <button 
              onClick={() => setScreen('CREATE_GROUP')}
              className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-black/5 flex flex-col items-center gap-3 md:gap-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-50 text-[#D9A441] flex items-center justify-center">
                <PlusCircle size={24} />
              </div>
              <div className="text-center">
                <p className="font-black text-sm text-[#1A1A1A]">Criar</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Kixikila</p>
              </div>
            </button>
            
            <button 
              onClick={() => setScreen('NOTES')}
              className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-black/5 flex flex-col items-center gap-3 md:gap-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <Book size={24} />
              </div>
              <div className="text-center">
                <p className="font-black text-sm text-[#1A1A1A]">Caderno</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Anotações</p>
              </div>
            </button>
            
            <button 
              onClick={() => setScreen('CORPORATE')}
              className="bg-[#1A1A1A] p-4 md:p-6 rounded-[24px] md:rounded-[32px] flex flex-col items-center gap-3 md:gap-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 text-[#D9A441] flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <div className="text-center">
                <p className="font-black text-sm text-white">Gestão</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Empresas</p>
              </div>
            </button>
          </div>
        </section>

        {/* Next Payments */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#1A1A1A]">Próximas Vezes</h3>
            <button 
              onClick={() => setScreen('MY_GROUPS')}
              className="text-xs font-black text-[#F23030] uppercase tracking-widest"
            >
              Ver Todos
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Maria Silva', group: 'Grupo Mutamba Solidária', date: '25 Jun', status: 'CONFIRMADO', color: 'text-emerald-500' },
              { name: 'João Pedro', group: 'Kixikila dos Manos', date: '02 Jul', status: 'PENDENTE', color: 'text-[#D9A441]' },
              { name: 'Sofia Costa', group: 'Poupança Família', date: '09 Jul', status: 'AGENDADO', color: 'text-slate-400' }
            ].map((p, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#1A1A1A]">{p.name}</p>
                    <p className="text-xs text-slate-400 font-bold">{p.group}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-[#1A1A1A]">{p.date}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${p.color}`}>{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
