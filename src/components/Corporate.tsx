import React from 'react';
import { Building2, TrendingUp, Users, Calendar, ArrowRight, Wallet, ChevronRight, Info, UserCheck, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { type AppScreen } from '../types';

interface CorporateProps {
  setScreen: (screen: AppScreen) => void;
}

export const Corporate = ({ setScreen }: CorporateProps) => {
  const companyName = "Unitel S.A.";

  const otherGroups = [
    { id: 1, name: "Kixikila Executiva", value: "50.000", period: "Mensal", members: 12 },
    { id: 2, name: "Kixikila de Natal", value: "10.000", period: "Semanal", members: 45 },
    { id: 3, name: "Kixikila de Viagem", value: "100.000", period: "Anual", members: 8 },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#D9A441] mb-1">Administração</p>
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A]">Esta é a empresa {companyName}</h2>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center">
          <Building2 className="text-[#F23030]" />
        </div>
      </div>

      {/* Main Corporate Card */}
      <div className="bg-[#1A1A1A] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Unitel_logo.svg/1200px-Unitel_logo.svg.png" 
                   alt="Unitel" className="object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className="text-xl font-black">{companyName}</h3>
              <p className="text-slate-400 text-xs">NIF: 5000234567</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5">
              <p className="text-[9px] uppercase font-black text-slate-500 mb-1">Fundo Social</p>
              <p className="text-lg font-black">Kz 4.500.000</p>
              <p className="text-[9px] text-emerald-400 font-bold mt-1">↗ +24.5%</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5">
              <p className="text-[9px] uppercase font-black text-slate-500 mb-1">Colaboradores</p>
              <p className="text-lg font-black">342</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1">28 Grupos</p>
            </div>
          </div>

          {/* Open Kixikila Alert */}
          <button 
            onClick={() => setScreen('VOTING')}
            className="w-full bg-[#F23030] py-4 rounded-2xl flex items-center justify-between px-5 font-black group active:scale-[0.98] transition-all"
          >
            <div className="text-left">
              <p className="text-[9px] uppercase opacity-60">Kixikila Aberta</p>
              <p className="text-base">Grupo de 15 pessoas</p>
              <p className="text-[9px] opacity-60">Kz 5.000 • Semanal</p>
            </div>
            <div className="bg-white text-[#F23030] px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-widest">
              ENTRAR AGORA
            </div>
          </button>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#F23030]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Simplified Chart Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-lg">Histórico de Contribuições</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase">Gráfico de Fluxo</span>
        </div>
        
        <div className="bg-white rounded-[32px] p-6 border border-black/5 shadow-sm">
          <div className="flex items-end justify-between h-32 gap-2 mb-4">
            {[40, 70, 30, 90, 50, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className={`w-full rounded-t-lg ${i === 3 ? 'bg-[#F23030]' : i % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#D9A441]'}`}
                />
                <span className="text-[8px] font-black text-slate-400 uppercase">{['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Groups Section */}
      <section>
        <h3 className="font-black text-lg mb-4">Outros Grupos da Empresa</h3>
        <div className="space-y-3">
          {otherGroups.map((group) => (
            <div key={group.id} className="bg-white p-4 rounded-3xl border border-black/5 flex items-center justify-between hover:border-[#D9A441]/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#D9A441]">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="font-black text-sm">{group.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{group.period} • {group.members} membros</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-black text-sm text-[#1A1A1A]">Kz {group.value}</p>
                <button 
                  onClick={() => setScreen('VOTING')}
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#1A1A1A] hover:text-white transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collaborators Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-lg">Colaboradores Activos</h3>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full">12 Online</span>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'João Manuel', dept: 'RH', val: '5.000', status: 'CONFIRMADO' },
            { name: 'Sara Antónia', dept: 'Marketing', val: '5.000', status: 'PENDENTE' },
            { name: 'Mário Silva', dept: 'TI', val: '10.000', status: 'CONFIRMADO' }
          ].map((c, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                  <img src={`https://picsum.photos/seed/colab${i}/100`} alt="avatar" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="font-black text-sm">{c.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{c.dept}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm">Kz {c.val}</p>
                <p className={`text-[9px] font-black ${c.status === 'CONFIRMADO' ? 'text-emerald-500' : 'text-[#D9A441]'}`}>{c.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest pt-4">
        Kixikila Corporativa • {companyName}
      </p>
    </div>
  );
};
