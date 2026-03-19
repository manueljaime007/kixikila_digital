import React, { useState } from 'react';
import { Book, History, CheckCircle2, Plus, X, User, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NoteEntry {
  id: string;
  name: string;
  val: string;
  date: string;
  status: 'PAGO' | 'PENDENTE' | 'RECEBER';
  color: string;
}

export const Notes = () => {
  const [entries, setEntries] = useState<NoteEntry[]>([
    { id: '1', name: 'Abraão Mano', val: '5.000', date: '12 Out', status: 'PAGO', color: 'bg-yellow-100 text-yellow-700' },
    { id: '2', name: 'Beatriz Mana', val: '5.000', date: '14 Out', status: 'PENDENTE', color: 'bg-red-100 text-red-700' },
    { id: '3', name: 'Cláudio Mano', val: '5.000', date: '15 Out', status: 'RECEBER', color: 'bg-blue-100 text-blue-700' },
    { id: '4', name: 'Dina Mana', val: '5.000', date: '15 Out', status: 'PENDENTE', color: 'bg-purple-100 text-purple-700' }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'Todos' | 'Pendentes' | 'Finalizados'>('Todos');
  
  const [newName, setNewName] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newStatus, setNewStatus] = useState<'PAGO' | 'PENDENTE' | 'RECEBER'>('PENDENTE');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: NoteEntry = {
      id: Date.now().toString(),
      name: newName,
      val: newVal,
      date: new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' }),
      status: newStatus,
      color: `bg-slate-100 text-slate-700`
    };
    setEntries([newEntry, ...entries]);
    setIsAdding(false);
    setNewName('');
    setNewVal('');
  };

  const toggleStatus = (id: string) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const nextStatus: Record<string, 'PAGO' | 'PENDENTE' | 'RECEBER'> = {
          'PENDENTE': 'PAGO',
          'PAGO': 'RECEBER',
          'RECEBER': 'PENDENTE'
        };
        return { ...entry, status: nextStatus[entry.status] };
      }
      return entry;
    }));
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === 'Todos') return true;
    if (filter === 'Pendentes') return entry.status === 'PENDENTE';
    if (filter === 'Finalizados') return entry.status === 'PAGO';
    return true;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-[#1A1A1A]">Caderno Digital</h2>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <History size={24} className="text-slate-400" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333] rounded-[40px] p-8 text-white mb-8 shadow-xl">
        <h3 className="text-2xl font-black mb-2">Gestão Informal</h3>
        <p className="text-slate-400 text-sm mb-8">Controle manual para grupos offline da banda.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-md">
            <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Participantes</p>
            <p className="text-3xl font-black">{entries.length}</p>
          </div>
          <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-md">
            <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Ciclo Actual</p>
            <p className="text-3xl font-black">3ª Ed.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-slate-100">
        {['Todos', 'Pendentes', 'Finalizados'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setFilter(tab as any)}
            className={`pb-4 px-2 text-sm font-black transition-all relative ${
              filter === tab ? 'text-[#F23030]' : 'text-slate-400'
            }`}
          >
            {tab}
            {filter === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F23030] rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          <span className="col-span-2">Nome / Status</span>
          <span>Valor</span>
          <span className="text-right">Acção</span>
        </div>
        
        <AnimatePresence>
          {filteredEntries.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id} 
              className="bg-white p-4 rounded-3xl border border-black/5 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3 col-span-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${item.color}`}>
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-black text-sm">{item.name}</p>
                  <p className={`text-[9px] font-black uppercase tracking-wider ${
                    item.status === 'PAGO' ? 'text-emerald-500' : 
                    item.status === 'RECEBER' ? 'text-blue-500' : 'text-red-500'
                  }`}>
                    {item.status} • {item.date}
                  </p>
                </div>
              </div>
              <p className="font-black text-sm">Kz {item.val}</p>
              <button 
                onClick={() => toggleStatus(item.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  item.status === 'PAGO' ? 'bg-[#D9A441] text-white' : 
                  item.status === 'RECEBER' ? 'bg-blue-500 text-white' : 'border-2 border-slate-100 text-slate-200'
                }`}
              >
                <CheckCircle2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEntries.length === 0 && (
          <div className="py-12 text-center text-slate-400 italic text-sm">
            Nenhuma anotação encontrada nesta categoria.
          </div>
        )}
      </div>

      <div className="mt-8 p-8 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <Book size={24} />
        </div>
        <p className="text-sm text-slate-400 font-medium max-w-[200px]">
          Usa o caderno para anotar quem já pagou, quem vai receber e quem ainda deve na banda.
        </p>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[40px] w-full max-w-md p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Nova Anotação</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Nome do Mano/Mana</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                    <User size={20} className="text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-transparent w-full font-bold focus:outline-none" 
                      placeholder="Ex: João Manuel" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Valor da Kixikila</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                    <DollarSign size={20} className="text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                      className="bg-transparent w-full font-bold focus:outline-none" 
                      placeholder="Ex: 5.000" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#F23030] uppercase tracking-widest">Status Inicial</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['PENDENTE', 'PAGO', 'RECEBER'] as const).map((s) => (
                      <button 
                        key={s}
                        type="button"
                        onClick={() => setNewStatus(s)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          newStatus === s ? 'bg-[#F23030] text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary mt-4">
                  GUARDAR NO CADERNO
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-[#F23030] text-white rounded-full shadow-2xl shadow-red-500/40 flex items-center justify-center active:scale-90 transition-transform z-50"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};
