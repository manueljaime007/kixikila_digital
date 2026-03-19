import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Vote, MessageSquare, ChevronLeft, CheckCircle2, Share2, History, X, User, TrendingUp, ShieldCheck, Calendar } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Participant {
  id: string;
  name: string;
  votes: number;
  votedByMe: boolean;
  hasReceived?: boolean;
  dept?: string;
  history: {
    totalContributed: string;
    groupsJoined: number;
    reliability: string;
    lastReceived: string;
  };
}

export const Voting = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Abraão', text: 'Boa tarde manos! Vamos decidir a ordem?', time: '14:20', isMe: false },
    { id: '2', user: 'Beatriz', text: 'Eu voto na Maria para ser a primeira!', time: '14:22', isMe: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([
    { 
      id: '1', 
      name: 'Maria Silva', 
      votes: 3, 
      votedByMe: false,
      hasReceived: true,
      dept: 'Recursos Humanos',
      history: { totalContributed: '450.000', groupsJoined: 12, reliability: '98%', lastReceived: 'Jan 2024' }
    },
    { 
      id: '2', 
      name: 'João Manuel', 
      votes: 1, 
      votedByMe: false,
      hasReceived: false,
      dept: 'Marketing',
      history: { totalContributed: '120.000', groupsJoined: 5, reliability: '95%', lastReceived: 'Mar 2024' }
    },
    { 
      id: '3', 
      name: 'Sara Antónia', 
      votes: 0, 
      votedByMe: false,
      hasReceived: false,
      dept: 'TI',
      history: { totalContributed: '300.000', groupsJoined: 8, reliability: '100%', lastReceived: 'Dez 2023' }
    },
    { 
      id: '4', 
      name: 'Eu (Mano)', 
      votes: 0, 
      votedByMe: false,
      hasReceived: false,
      dept: 'Financeiro',
      history: { totalContributed: '50.000', groupsJoined: 2, reliability: '100%', lastReceived: 'Nunca' }
    },
  ]);

  const sortedParticipants = [...participants].sort((a, b) => b.votes - a.votes);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'Eu',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleVote = (id: string) => {
    setParticipants(participants.map(p => {
      if (p.id === id) {
        return { ...p, votes: p.votedByMe ? p.votes - 1 : p.votes + 1, votedByMe: !p.votedByMe };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <header className="bg-white p-6 border-b border-black/5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-50 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-black text-lg">Círculo de Confiança</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#D9A441]">Votação em Curso</p>
          </div>
        </div>
        <button className="p-2 bg-[#F23030]/10 text-[#F23030] rounded-full">
          <Share2 size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {/* Voting Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Vote size={20} className="text-[#F23030]" />
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Ordem de Recebimento</h3>
              </div>
              <span className="text-[10px] font-black text-[#D9A441] bg-[#D9A441]/10 px-2 py-1 rounded-lg">DEFININDO 1º AO 4º</span>
            </div>
            
            <div className="space-y-3">
              {sortedParticipants.map((p, index) => (
                <motion.div 
                  layout
                  key={p.id} 
                  className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
                    p.votedByMe ? 'bg-white border-[#F23030] shadow-lg shadow-red-500/5' : 'bg-white border-black/5'
                  } ${p.hasReceived ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button 
                        onClick={() => setSelectedUser(p)}
                        className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-xs overflow-hidden border-2 border-transparent hover:border-[#D9A441] transition-all"
                      >
                        <img src={`https://picsum.photos/seed/user${p.id}/100`} alt="avatar" referrerPolicy="no-referrer" />
                      </button>
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                        {index + 1}º
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm">{p.name}</p>
                        {p.hasReceived && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[8px] font-black uppercase">
                            <CheckCircle2 size={8} /> Recebeu
                          </span>
                        )}
                        <button 
                          onClick={() => setSelectedUser(p)}
                          className="p-1 bg-slate-50 rounded-lg text-[#D9A441] hover:bg-[#D9A441] hover:text-white transition-all"
                        >
                          <History size={12} />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400">{p.votes} votos • {p.dept}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleVote(p.id)}
                    disabled={p.hasReceived}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      p.votedByMe ? 'bg-[#F23030] text-white' : 'bg-slate-50 text-slate-400'
                    } ${p.hasReceived ? 'cursor-not-allowed grayscale' : ''}`}
                  >
                    {p.votedByMe ? 'Votado' : 'Votar'}
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Mini Chat Section */}
          <section className="flex flex-col h-[400px] bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-black/5 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#F23030]" />
                <span className="text-xs font-black uppercase tracking-widest">Chat do Grupo</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                4 Online
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${
                    msg.isMe ? 'bg-[#F23030] text-white rounded-tr-none' : 'bg-slate-100 text-[#1A1A1A] rounded-tl-none'
                  }`}>
                    {!msg.isMe && <p className="text-[9px] font-black uppercase mb-1 opacity-50">{msg.user}</p>}
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-black/5 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreve aqui..."
                className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#F23030]/20 outline-none"
              />
              <button type="submit" className="w-12 h-12 bg-[#F23030] text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
                <Send size={20} />
              </button>
            </form>
          </section>

          <div className="p-6 bg-[#D9A441]/10 rounded-[40px] border border-[#D9A441]/20">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-[#D9A441]" />
              <h4 className="font-black text-sm">Próximos Passos</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Assim que a votação terminar, o sistema irá gerar o calendário de pagamentos automaticamente. Convida mais manos para acelerar o processo!
            </p>
          </div>
        </div>
      </div>

      {/* User History Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#1A1A1A] p-8 text-white relative">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-white p-1">
                    <img 
                      src={`https://picsum.photos/seed/user${selectedUser.id}/200`} 
                      alt="avatar" 
                      className="w-full h-full object-cover rounded-2xl"
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{selectedUser.name}</h3>
                    <p className="text-slate-400 font-bold text-sm">{selectedUser.dept}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Membro Confiável</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Total Contribuído</p>
                    <p className="text-lg font-black">Kz {selectedUser.history.totalContributed}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Fiabilidade</p>
                    <p className="text-lg font-black text-emerald-400">{selectedUser.history.reliability}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">Histórico de Kixikilas</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <TrendingUp size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold">Grupos Participados</span>
                      </div>
                      <span className="font-black">{selectedUser.history.groupsJoined}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-[#D9A441]" />
                        <span className="text-xs font-bold">Último Recebimento</span>
                      </div>
                      <span className="font-black">{selectedUser.history.lastReceived}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    handleVote(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-3"
                >
                  <Vote size={20} />
                  {selectedUser.votedByMe ? 'REMOVER VOTO' : 'VOTAR NESTE MANO'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
