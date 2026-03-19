import React, { useState } from 'react';
import { Search, PlusCircle, Users, ChevronRight, ShieldCheck, Star } from 'lucide-react';
import { Frequency, GroupType, type KixikilaGroup } from '../types';
import { motion } from 'framer-motion';

interface GroupsProps {
  groups: KixikilaGroup[];
  onJoin: (id: string) => void;
  onCreate: () => void;
}

export const Groups = ({ groups, onJoin, onCreate }: GroupsProps) => {
  const [filter, setFilter] = useState<string>('Todos');
  const [search, setSearch] = useState('');

  const filteredGroups = groups.filter(g => {
    const matchesFilter = filter === 'Todos' || g.frequency === filter;
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                         g.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-[#1A1A1A]">Kixikila da Banda</h2>
        <button 
          onClick={onCreate}
          className="w-12 h-12 bg-[#F23030] text-white rounded-full shadow-lg shadow-red-500/20 flex items-center justify-center active:scale-90 transition-transform"
        >
          <PlusCircle size={28} />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Encontrar grupos..." 
          className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#F23030]/20 text-lg"
        />
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {['Todos', Frequency.DAILY, Frequency.WEEKLY, Frequency.MONTHLY, Frequency.ANNUAL].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              filter === cat 
                ? "bg-[#F23030] text-white shadow-md shadow-red-500/20" 
                : "bg-white text-slate-600 border border-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-500 uppercase text-xs tracking-widest">Grupos Activos</h3>
          <span className="text-xs font-bold text-[#F23030]">{filteredGroups.length} Encontrados</span>
        </div>
        
        {filteredGroups.map((group) => (
          <motion.div 
            layout
            key={group.id} 
            className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {group.verified && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-[#D9A441] text-white text-[9px] font-black uppercase rounded-lg tracking-wider">
                      <ShieldCheck size={10} /> Verificar Confiança
                    </span>
                  )}
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg tracking-wider">
                    {group.type}
                  </span>
                </div>
                <h4 className="font-black text-xl text-[#1A1A1A]">{group.name}</h4>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F5F2ED] flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {group.currentMembers}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-[#F5F2ED] p-3 rounded-2xl text-center">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Valor</p>
                <p className="text-sm font-black text-[#1A1A1A]">{group.contribution >= 1000 ? `${group.contribution/1000}k` : group.contribution} Kz</p>
              </div>
              <div className="bg-[#F5F2ED] p-3 rounded-2xl text-center">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Frequência</p>
                <p className="text-sm font-black text-[#1A1A1A]">{group.frequency}</p>
              </div>
              <div className="bg-[#F5F2ED] p-3 rounded-2xl text-center">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Status</p>
                <p className={`text-sm font-black ${group.status === 'Cheio' ? 'text-red-500' : 'text-emerald-600'}`}>
                  {group.status || 'Aberto'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => onJoin(group.id)}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                group.status === 'Cheio' 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#F23030] text-white hover:bg-[#D12626] shadow-lg shadow-red-500/10'
              }`}
            >
              {group.status === 'Cheio' ? 'Grupo Lotado' : 'Aderir ao Grupo'}
              {group.status !== 'Cheio' && <ChevronRight size={18} />}
            </button>
          </motion.div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={40} />
            </div>
            <p className="text-slate-500 font-bold">Nenhum grupo encontrado na banda...</p>
          </div>
        )}
      </div>
    </div>
  );
};
