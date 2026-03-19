import React, { useState, useEffect } from "react";
import {
  Wallet,
  Users,
  Settings as SettingsIcon,
  PlusCircle,
  ArrowUpRight,
  ChevronRight,
  LogOut,
  User,
  Bell,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  X,
  Home,
  Book,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Frequency,
  GroupType,
  type KixikilaGroup,
  type User as UserType,
  type AppScreen,
} from "./types";

import { Splash } from "./components/Splash";
import { Dashboard } from "./components/Dashboard";
import { Groups } from "./components/Groups";
import { Corporate } from "./components/Corporate";
import { Notes } from "./components/Notes";
import { Voting } from "./components/Voting";
import { Settings } from "./components/Settings";
import { cn } from "./libs/utils";



const TERMS_TEXT = (
  <>
    A nossa aplicação compromete-se a garantir a segurança, privacidade e
    proteção dos dados de todos os usuários, tratando todas as informações
    fornecidas com confidencialidade e responsabilidade.
    <br />
    <br />
    Os dados solicitados durante o cadastramento são utilizados apenas para
    identificação, comunicação e funcionamento adequado da plataforma,
    permitindo uma relação segura e transparente entre os usuários.
    <br />
    <br />
    Ao utilizar a aplicação, o usuário concorda em fornecer informações
    verdadeiras, respeitar as regras de utilização da plataforma e utilizar os
    serviços de forma responsável e legal.
    <br />
    <br />A aplicação reserva-se ainda o direito de proteger o sistema contra
    usos indevidos, podendo suspender ou limitar contas que violem os termos de
    funcionamento, garantindo assim um ambiente digital seguro, confiável e
    eficiente para todos os clientes e colaboradores.
  </>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[32px] shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-[#1A1A1A]">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const VerificationModal = ({
  isOpen,
  onComplete,
}: {
  isOpen: boolean;
  onComplete: () => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Verificando Conta">
      <div className="flex flex-col items-center py-8 text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#F23030] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-lg font-black text-[#1A1A1A] mb-2">
          Identidade do Mano
        </p>
        <p className="text-slate-500 mb-4">
          Estamos a validar os seus dados e documentos na banda...
        </p>
        <p className="text-xs text-[#D9A441] font-black uppercase tracking-widest">
          Segurança da Banda
        </p>
      </div>
    </Modal>
  );
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("SPLASH");
  const [isVerifying, setIsVerifying] = useState(false);
  
  // ✅ signupUserId guarda o ID que vem da API após o cadastro
  const [signupUserId, setSignupUserId] = useState<number | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isBusinessSignup, setIsBusinessSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  // ✅ grupos vêm da BD, não são mock
  const [groups, setGroups] = useState<KixikilaGroup[]>([]);

  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ ao iniciar, verificar se há token guardado e restaurar sessão
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setScreen("DASHBOARD");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const validateField = (name: string, value: string) => {
    if (!value) return "Campo obrigatório";
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email inválido";
      case "phone":
        return /^9\d{8}$/.test(value)
          ? ""
          : "Telemóvel deve ter 9 dígitos e começar com 9";
      case "bi_number":
        return /^\d{9}[A-Z]{2}\d{3}$/.test(value)
          ? ""
          : "Formato inválido (ex: 000000000LA000)";
      case "pin":
        return /^\d{4}$/.test(value) ? "" : "PIN deve ter 4 dígitos";
      case "account_number":
        return value.length >= 10 ? "" : "Número de conta inválido";
      default:
        return "";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = (e.target as any).identifier.value;
    const password = (e.target as any).password.value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // ✅ guardar token e user no localStorage para persistir sessão
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setScreen("DASHBOARD");
      } else {
        alert(data.error || "Erro ao entrar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalSteps = isBusinessSignup ? 4 : 5;

    if (signupStep < totalSteps) {
      setSignupStep(signupStep + 1);
      return;
    }

    // ✅ só chega aqui no último passo — chama a API
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: isBusinessSignup ? "business" : "individual",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // ✅ guardar o ID para buscar o user depois
        setSignupUserId(data.id);
        setIsVerifying(true);
      } else {
        alert(data.error || "Erro ao cadastrar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
  };

  // ✅ chamado depois dos 3 segundos de animação — faz login automático com os dados do form
  const completeSignup = async () => {
    setIsVerifying(false);
    setSignupStep(1);

    try {
      // fazer login automático com as credenciais que o user acabou de criar
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.email || formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setFormData({});
        setScreen("DASHBOARD");
      } else {
        // fallback: se o login automático falhar, mandar para o login manual
        setScreen("LOGIN");
      }
    } catch {
      setScreen("LOGIN");
    }
  };

  const handleDeposit = async (amount: number, method: string) => {
    if (!user) return;
    try {
      const response = await fetch("/api/transactions/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: (user as any).id, amount, method }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Depósito realizado com sucesso!");
        const updatedUser = { ...user, balance: user.balance + amount };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setScreen("DASHBOARD");
      } else {
        alert(data.error || "Erro ao processar depósito");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
  };

  const renderTerms = () => (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A] text-white p-8 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto flex-1 flex flex-col"
      >
        <div className="w-16 h-16 bg-[#F23030] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-500/20 mx-auto">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black mb-6 leading-tight text-center">
          Termos e Políticas de Funcionamento
        </h1>
        <div className="flex-1 overflow-y-auto bg-white/5 rounded-[32px] p-6 mb-8 border border-white/10">
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            {TERMS_TEXT}
          </p>
        </div>
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setScreen("LOGIN")}
            className="w-full py-4 bg-[#F23030] text-white font-black rounded-2xl shadow-xl shadow-red-500/20 uppercase tracking-widest text-sm"
          >
            Aceitar e Continuar
          </button>
          <button
            onClick={() =>
              alert(
                "Para utilizar a aplicação Kixikila Digital, é necessário aceitar os termos de funcionamento.",
              )
            }
            className="w-full py-4 bg-white/5 text-slate-400 font-black rounded-2xl border border-white/10 uppercase tracking-widest text-sm"
          >
            Não Concordo
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen flex flex-col bg-[#F5F2ED]">
      <div className="p-8 pt-12 flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center mb-8">
          <button
            onClick={() => setScreen("SPLASH")}
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
          Ainda não é Mano?{" "}
          <button
            onClick={() => setScreen("SIGNUP")}
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

  const renderSignup = () => {
    const totalSteps = isBusinessSignup ? 4 : 5;

    const updateFormData = (name: string, value: string) => {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors((prev: any) => ({ ...prev, [name]: error }));
    };

    return (
      <div className="min-h-screen flex flex-col bg-[#F5F2ED]">
        <div className="p-8 pt-12 flex-1 overflow-y-auto max-w-md mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                if (signupStep > 1) {
                  setSignupStep(signupStep - 1);
                } else if (isBusinessSignup) {
                  setIsBusinessSignup(false);
                  setSignupStep(1);
                } else {
                  setScreen("LOGIN");
                  setSignupStep(1);
                }
              }}
              className="p-2 bg-white rounded-full shadow-sm border border-black/5"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-black">
                {isBusinessSignup ? "Cadastro Empresarial" : "Cadastro de Mano"}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Passo {signupStep} de {totalSteps}
              </p>
            </div>
            <div className="w-10"></div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#F23030] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/20">
              {isBusinessSignup ? (
                <Building2 size={32} className="text-white" />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <h1 className="text-2xl font-black text-[#1A1A1A] text-center leading-tight">
              {isBusinessSignup ? "Dados da Empresa" : "Dados do Mano"}
            </h1>
            <div className="flex gap-1 mt-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    i + 1 <= signupStep
                      ? "w-6 bg-[#F23030]"
                      : "w-2 bg-slate-200",
                  )}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {!isBusinessSignup ? (
              <>
                {signupStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Dados Pessoais
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Ex: Manuel dos Santos"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Nascimento
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.birth_date || ""}
                          onChange={(e) =>
                            updateFormData("birth_date", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input bg-transparent"
                        />
                      </div>
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Sexo
                        </label>
                        <select
                          required
                          value={formData.gender || ""}
                          onChange={(e) =>
                            updateFormData("gender", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input bg-transparent"
                        >
                          <option value="">Selecionar</option>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Nº do Bilhete (BI)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bi_number || ""}
                        onChange={(e) =>
                          updateFormData("bi_number", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="000000000LA000"
                      />
                      {errors.bi_number && (
                        <p className="text-[9px] text-red-500 mt-1 font-bold">
                          {errors.bi_number}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Emissão
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.emission_date || ""}
                          onChange={(e) =>
                            updateFormData("emission_date", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input bg-transparent"
                        />
                      </div>
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Nacionalidade
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nationality || ""}
                          onChange={(e) =>
                            updateFormData("nationality", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input"
                          placeholder="Angolana"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {signupStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Dados de Contacto
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Telemóvel
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone || ""}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="9xx xxx xxx"
                      />
                      {errors.phone && (
                        <p className="text-[9px] text-red-500 mt-1 font-bold">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email || ""}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="email@exemplo.com"
                      />
                      {errors.email && (
                        <p className="text-[9px] text-red-500 mt-1 font-bold">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Endereço Residencial
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address || ""}
                        onChange={(e) =>
                          updateFormData("address", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Bairro, Rua..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Município
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.municipality || ""}
                          onChange={(e) =>
                            updateFormData("municipality", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input"
                          placeholder="Ex: Belas"
                        />
                      </div>
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Província
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.province || ""}
                          onChange={(e) =>
                            updateFormData("province", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input"
                          placeholder="Ex: Luanda"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {signupStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Dados Profissionais
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Profissão
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.profession || ""}
                        onChange={(e) =>
                          updateFormData("profession", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Ex: Professor"
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Local de Trabalho
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.workplace || ""}
                        onChange={(e) =>
                          updateFormData("workplace", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Nome da Empresa"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Tempo de Serviço
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.service_time || ""}
                          onChange={(e) =>
                            updateFormData("service_time", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input"
                          placeholder="Anos"
                        />
                      </div>
                      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                        <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                          Renda Mensal (Kz)
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.monthly_income || ""}
                          onChange={(e) =>
                            updateFormData("monthly_income", e.target.value)
                          }
                          className="w-full font-bold focus:outline-none no-animation-input"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {signupStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Dados Bancários
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Banco
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bank || ""}
                        onChange={(e) => updateFormData("bank", e.target.value)}
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Ex: BFA"
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Nº de Conta ou IBAN
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.account_number || ""}
                        onChange={(e) =>
                          updateFormData("account_number", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="AO06 0000 0000 ..."
                      />
                    </div>
                  </div>
                )}
                {signupStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Acesso e Finalização
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Palavra-passe
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password || ""}
                        onChange={(e) =>
                          updateFormData("password", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="••••••••"
                        minLength={8}
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Confirmar Palavra-passe
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.confirm_password || ""}
                        onChange={(e) =>
                          updateFormData("confirm_password", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="••••••••"
                      />
                      {formData.password &&
                        formData.confirm_password &&
                        formData.password !== formData.confirm_password && (
                          <p className="text-[9px] text-red-500 mt-1 font-bold">
                            As senhas não coincidem
                          </p>
                        )}
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        PIN de Segurança (4 dígitos)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={formData.pin || ""}
                        onChange={(e) => updateFormData("pin", e.target.value)}
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="••••"
                      />
                      {errors.pin && (
                        <p className="text-[9px] text-red-500 mt-1 font-bold">
                          {errors.pin}
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center gap-3">
                      <input
                        type="checkbox"
                        required
                        className="w-5 h-5 accent-[#F23030]"
                      />
                      <p className="text-[10px] font-medium text-slate-600">
                        Aceito os{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#F23030] font-black hover:underline"
                        >
                          Termos e Condições
                        </button>{" "}
                        e a{" "}
                        <span className="text-[#F23030] font-black">
                          Política de Privacidade
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {signupStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Informações Institucionais
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Ex: Kixikila Tech Lda"
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Tipo de Empresa
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company_type || ""}
                        onChange={(e) =>
                          updateFormData("company_type", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Ex: Sociedade Unipessoal"
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        NIF da Empresa
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bi_number || ""}
                        onChange={(e) =>
                          updateFormData("bi_number", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="5000000000"
                      />
                    </div>
                  </div>
                )}
                {signupStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Contactos
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone || ""}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="9xx xxx xxx"
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Email Institucional
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email || ""}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="empresa@exemplo.com"
                      />
                    </div>
                  </div>
                )}
                {signupStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Dados Financeiros
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Banco
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bank || ""}
                        onChange={(e) => updateFormData("bank", e.target.value)}
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="Ex: BIC"
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Nº de Conta ou IBAN
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.account_number || ""}
                        onChange={(e) =>
                          updateFormData("account_number", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="AO06 0000 0000 ..."
                      />
                    </div>
                  </div>
                )}
                {signupStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Acesso
                    </h3>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        Palavra-passe
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password || ""}
                        onChange={(e) =>
                          updateFormData("password", e.target.value)
                        }
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="••••••••"
                        minLength={8}
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">
                        PIN de Segurança
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={formData.pin || ""}
                        onChange={(e) => updateFormData("pin", e.target.value)}
                        className="w-full font-bold focus:outline-none no-animation-input"
                        placeholder="••••"
                      />
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center gap-3">
                      <input
                        type="checkbox"
                        required
                        className="w-5 h-5 accent-[#F23030]"
                      />
                      <p className="text-[10px] font-medium text-slate-600">
                        Aceitamos os{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#F23030] font-black hover:underline"
                        >
                          Termos e Condições
                        </button>{" "}
                        da plataforma.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="bg-[#D9A441]/10 p-5 rounded-3xl border border-[#D9A441]/20 flex gap-4">
              <div className="w-10 h-10 bg-[#D9A441] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-[#1A1A1A] mb-1">
                  Segurança Garantida
                </p>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                  Os teus dados são encriptados e nunca partilhados. Kixikila
                  Digital é construída sobre a confiança.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary mt-4 flex items-center justify-center gap-3"
            >
              {signupStep === totalSteps
                ? "FINALIZAR CADASTRO"
                : "PRÓXIMO PASSO"}{" "}
              <ChevronRight size={20} />
            </button>

            {signupStep === 1 && !isBusinessSignup && (
              <button
                type="button"
                onClick={() => {
                  setIsBusinessSignup(true);
                  setSignupStep(1);
                  setFormData({});
                }}
                className="w-full py-4 bg-white border-2 border-[#D9A441] text-[#D9A441] font-black rounded-2xl uppercase tracking-widest text-xs mt-2"
              >
                Conta Empresarial
              </button>
            )}
          </form>
        </div>
        <VerificationModal isOpen={isVerifying} onComplete={completeSignup} />
        <Modal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          title="Termos e Condições"
        >
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {TERMS_TEXT}
            </p>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full btn-primary mt-8"
            >
              ENTENDI
            </button>
          </div>
        </Modal>
      </div>
    );
  };

  const renderCreateGroup = () => (
    <div className="p-8 max-w-2xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => setScreen("DASHBOARD")}
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
              <option>{Frequency.DAILY}</option>
              <option>{Frequency.WEEKLY}</option>
              <option>{Frequency.MONTHLY}</option>
              <option>{Frequency.ANNUAL}</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">
            Tipo de Kixikila
          </label>
          <div className="grid grid-cols-1 gap-3">
            <button className="p-4 rounded-2xl border-2 border-[#F23030] bg-red-50 text-[#F23030] font-black text-xs uppercase tracking-widest">
              Normal
            </button>
          </div>
        </div>
        <button
          onClick={() => setScreen("VOTING")}
          className="w-full btn-primary mt-8"
        >
          INICIAR E CONVIDAR MANOS
        </button>
      </div>
    </div>
  );

  // ✅ renderDeposit corrigido — useState removido de dentro da função
  const [depositAmount, setDepositAmount] = useState("");

  const renderDeposit = () => (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => setScreen("DASHBOARD")}
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
            {user?.balance.toLocaleString("pt-AO")} Kz
          </h3>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-4">
            Valor a Carregar
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
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
          {[
            {
              id: "express",
              name: "Multicaixa Express",
              desc: "Pagamento instantâneo via App",
              icon: <Smartphone />,
              color: "bg-blue-50 text-blue-600",
            },
            {
              id: "afrimoney",
              name: "Afrimoney",
              desc: "Carteira móvel Africell",
              icon: <Wallet />,
              color: "bg-orange-50 text-orange-600",
            },
            {
              id: "unitel",
              name: "Unitel Money",
              desc: "Carteira móvel Unitel",
              icon: <Smartphone />,
              color: "bg-yellow-50 text-yellow-600",
            },
            {
              id: "paypay",
              name: "PayPay",
              desc: "Pagamento digital PayPay",
              icon: <CreditCard />,
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              id: "ekwanza",
              name: "éKwanza",
              desc: "Carteira digital éKwanza",
              icon: <Smartphone />,
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map((m, i) => (
            <button
              key={i}
              onClick={() => {
                if (!depositAmount || parseFloat(depositAmount) <= 0) {
                  alert("Insira um valor válido");
                  return;
                }
                handleDeposit(parseFloat(depositAmount), m.name);
              }}
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

  const renderWithdraw = () => (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => setScreen("DASHBOARD")}
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
            {user?.balance.toLocaleString("pt-AO")} Kz
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
          {[
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
          ].map((m, i) => (
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

  const renderContent = () => {
    switch (screen) {
      case "SPLASH":
        return <Splash onComplete={() => setScreen("TERMS")} />;
      case "TERMS":
        return renderTerms();
      case "LOGIN":
        return renderLogin();
      case "SIGNUP":
        return renderSignup();
      case "DASHBOARD":
        return <Dashboard user={user!} setScreen={setScreen} />;
      case "GROUPS":
        return (
          <Groups
            groups={groups}
            onJoin={() => setScreen("VOTING")}
            onCreate={() => setScreen("CREATE_GROUP")}
          />
        );
      case "CORPORATE":
        return <Corporate setScreen={setScreen} />;
      case "NOTES":
        return <Notes />;
      case "VOTING":
        return <Voting onBack={() => setScreen("DASHBOARD")} />;
      case "SETTINGS":
        return (
          <Settings
            user={user!}
            onLogout={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
              setScreen("LOGIN");
            }}
            onBack={() => setScreen("DASHBOARD")}
          />
        );
      case "CREATE_GROUP":
        return renderCreateGroup();
      case "DEPOSIT":
        return renderDeposit();
      case "WITHDRAW":
        return renderWithdraw();
      default:
        return <Dashboard user={user!} setScreen={setScreen} />;
    }
  };

  const showNav = !["SPLASH", "TERMS", "LOGIN", "SIGNUP"].includes(screen);

  return (
    <div
      className={cn(
        "min-h-screen",
        theme === "dark" ? "dark bg-[#1A1A1A] text-white" : "bg-[#F5F2ED]",
      )}
    >
      <div className={cn(showNav ? "lg:pl-72" : "")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNav && (
        <>
          <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-black/5 px-8 py-4 flex justify-between items-center z-40 lg:hidden rounded-t-[40px] shadow-2xl">
            <button
              onClick={() => setScreen("DASHBOARD")}
              className={cn(
                "p-2 flex flex-col items-center gap-1",
                screen === "DASHBOARD" ? "text-[#F23030]" : "text-slate-300",
              )}
            >
              <Home size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Início
              </span>
            </button>
            <button
              onClick={() => setScreen("GROUPS")}
              className={cn(
                "p-2 flex flex-col items-center gap-1",
                screen === "GROUPS" ? "text-[#F23030]" : "text-slate-300",
              )}
            >
              <Users size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Grupos
              </span>
            </button>
            <button
              onClick={() => setScreen("CREATE_GROUP")}
              className="w-14 h-14 bg-[#F23030] text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center -mt-12 border-4 border-[#F5F2ED] active:scale-90 transition-transform"
            >
              <PlusCircle size={32} />
            </button>
            <button
              onClick={() => setScreen("NOTES")}
              className={cn(
                "p-2 flex flex-col items-center gap-1",
                screen === "NOTES" ? "text-[#F23030]" : "text-slate-300",
              )}
            >
              <Book size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Caderno
              </span>
            </button>
            <button
              onClick={() => setScreen("WITHDRAW")}
              className={cn(
                "p-2 flex flex-col items-center gap-1",
                screen === "WITHDRAW" ? "text-[#F23030]" : "text-slate-300",
              )}
            >
              <ArrowUpRight size={26} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Saque
              </span>
            </button>
          </nav>

          <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-black/5 flex-col p-8 z-40">
            <div className="mb-12">
              <h1 className="text-2xl font-black tracking-tighter">
                KIXIKILA<span className="text-[#F23030]">.</span>
              </h1>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                Digital Banda
              </p>
            </div>
            <nav className="flex-1 space-y-2">
              {[
                { id: "DASHBOARD", label: "Início", icon: <Home size={22} /> },
                {
                  id: "GROUPS",
                  label: "Grupos da Banda",
                  icon: <Users size={22} />,
                },
                {
                  id: "CREATE_GROUP",
                  label: "Criar Kixikila",
                  icon: <PlusCircle size={22} />,
                },
                { id: "NOTES", label: "Meu Caderno", icon: <Book size={22} /> },
                {
                  id: "WITHDRAW",
                  label: "Levantar Saque",
                  icon: <ArrowUpRight size={22} />,
                },
                {
                  id: "CORPORATE",
                  label: "Corporativo",
                  icon: <Building2 size={22} />,
                },
                {
                  id: "SETTINGS",
                  label: "Configurações",
                  icon: <SettingsIcon size={22} />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id as AppScreen)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all",
                    screen === item.id
                      ? "bg-[#F23030] text-white shadow-lg shadow-red-500/20"
                      : "text-slate-400 hover:bg-slate-50 hover:text-[#1A1A1A]",
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pt-8 border-t border-black/5">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setUser(null);
                  setScreen("LOGIN");
                }}
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
