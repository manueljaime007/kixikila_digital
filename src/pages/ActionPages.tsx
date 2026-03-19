import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight, Smartphone, Wallet, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// ─── DEPOSIT ────────────────────────────────────────────────
export const DepositPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState("");

  const handleDeposit = async (method: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Insira um valor válido");
      return;
    }
    try {
      const response = await fetch("/api/transactions/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: (user as any).id,
          amount: parseFloat(amount),
          method,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Depósito realizado com sucesso!");
        updateUser({
          ...user!,
          balance: (user?.balance ?? 0) + parseFloat(amount),
        });
        navigate("/dashboard");
      } else {
        alert(data.error || "Erro ao processar depósito");
      }
    } catch {
      alert("Erro de conexão com o servidor");
    }
  };

  const methods = [
    {
      name: "Multicaixa Express",
      desc: "Pagamento instantâneo via App",
      icon: <Smartphone />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Afrimoney",
      desc: "Carteira móvel Africell",
      icon: <Wallet />,
      color: "bg-orange-50 text-orange-600",
    },
    {
      name: "Unitel Money",
      desc: "Carteira móvel Unitel",
      icon: <Smartphone />,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      name: "PayPay",
      desc: "Pagamento digital PayPay",
      icon: <CreditCard />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      name: "éKwanza",
      desc: "Carteira digital éKwanza",
      icon: <Smartphone />,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-3 bg-white rounded-2xl shadow-sm border border-black/5"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black">Carregar Conta</h2>
      </div>
      <div className="space-y-6">
        <div className="bg-[#D9A441] p-8 rounded-[40px] shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
            Saldo Actual
          </p>
          <h3 className="text-4xl font-black">
            {(user?.balance ?? 0).toLocaleString("pt-AO")} Kz
          </h3>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">
            Valor a Carregar
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-2xl font-black focus:outline-none no-animation-input"
              placeholder="0"
            />
            <span className="font-black text-slate-400">Kz</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Métodos de Pagamento
          </p>
          {methods.map((m, i) => (
            <button
              key={i}
              onClick={() => handleDeposit(m.name)}
              className="flex items-center justify-between p-6 bg-white rounded-[32px] border border-black/5 hover:border-[#F23030] transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    m.color,
                  )}
                >
                  {m.icon}
                </div>
                <div className="text-left">
                  <p className="font-black text-lg text-[#1A1A1A]">{m.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{m.desc}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-[#F23030] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── WITHDRAW ───────────────────────────────────────────────
export const WithdrawPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const methods = [
    {
      name: "Multicaixa Express",
      desc: "Saque instantâneo",
      icon: <Smartphone />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Afrimoney",
      desc: "Carteira móvel Africell",
      icon: <Wallet />,
      color: "bg-orange-50 text-orange-600",
    },
    {
      name: "Unitel Money",
      desc: "Carteira móvel Unitel",
      icon: <Smartphone />,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      name: "PayPay",
      desc: "Carteira digital PayPay",
      icon: <CreditCard />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      name: "éKwanza",
      desc: "Carteira digital éKwanza",
      icon: <Smartphone />,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-3 bg-white rounded-2xl shadow-sm border border-black/5"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black">Levantar Dinheiro</h2>
      </div>
      <div className="space-y-8">
        <div className="bg-[#1A1A1A] p-8 rounded-[40px] text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">
            Saldo para Saque
          </p>
          <h3 className="text-4xl font-black">
            {(user?.balance ?? 0).toLocaleString("pt-AO")} Kz
          </h3>
        </div>
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
            Quanto deseja levantar?
          </label>
          <div className="relative bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
            <input
              type="number"
              className="w-full text-4xl font-black focus:outline-none no-animation-input bg-transparent"
              placeholder="0,00"
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 text-2xl">
              Kz
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Enviar para Carteira
          </p>
          {methods.map((m, i) => (
            <button
              key={i}
              className="flex items-center justify-between p-6 bg-white rounded-[32px] border border-black/5 hover:border-[#F23030] transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    m.color,
                  )}
                >
                  {m.icon}
                </div>
                <div className="text-left">
                  <p className="font-black text-lg text-[#1A1A1A]">{m.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{m.desc}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-[#F23030] transition-colors" />
            </button>
          ))}
        </div>
        <button className="w-full btn-primary">CONFIRMAR SAQUE NA BANDA</button>
      </div>
    </div>
  );
};

// ─── CREATE GROUP ────────────────────────────────────────────
export const CreateGroupPage = () => {
  const navigate = useNavigate();

  const frequencies = ["Diário", "Semanal", "Mensal", "Anual"];

  return (
    <div className="p-8 max-w-2xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-3 bg-white rounded-2xl shadow-sm border border-black/5"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black">Criar Kixikila</h2>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">
            Nome do Círculo
          </label>
          <input
            type="text"
            className="w-full text-xl font-black focus:outline-none no-animation-input"
            placeholder="Ex: Kixikila da Família"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
            <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">
              Contribuição
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-full text-xl font-black focus:outline-none no-animation-input"
                placeholder="0"
              />
              <span className="font-black text-slate-400">Kz</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
            <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">
              Frequência
            </label>
            <select className="w-full text-sm font-black focus:outline-none bg-transparent">
              {frequencies.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">
            Tipo de Kixikila
          </label>
          <button className="w-full p-4 rounded-2xl border-2 border-[#F23030] bg-red-50 text-[#F23030] font-black text-xs uppercase tracking-widest">
            Normal
          </button>
        </div>
        <button
          onClick={() => navigate("/voting")}
          className="w-full btn-primary mt-8"
        >
          INICIAR E CONVIDAR MANOS
        </button>
      </div>
    </div>
  );
};
