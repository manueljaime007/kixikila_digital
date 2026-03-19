import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const TERMS_TEXT = (
  <>
    A nossa aplicação compromete-se a garantir a segurança, privacidade e proteção dos dados de todos os usuários, tratando todas as informações fornecidas com confidencialidade e responsabilidade.
    <br /><br />
    Os dados solicitados durante o cadastramento são utilizados apenas para identificação, comunicação e funcionamento adequado da plataforma, permitindo uma relação segura e transparente entre os usuários.
    <br /><br />
    Ao utilizar a aplicação, o usuário concorda em fornecer informações verdadeiras, respeitar as regras de utilização da plataforma e utilizar os serviços de forma responsável e legal.
    <br /><br />
    A aplicação reserva-se ainda o direito de proteger o sistema contra usos indevidos, podendo suspender ou limitar contas que violem os termos de funcionamento, garantindo assim um ambiente digital seguro, confiável e eficiente para todos os clientes e colaboradores.
  </>
);

const VerificationModal = ({ isOpen, onComplete }: { isOpen: boolean; onComplete: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] shadow-xl w-full max-w-md p-8"
      >
        <h3 className="text-2xl font-black text-[#1A1A1A] mb-6">Verificando Conta</h3>
        <div className="flex flex-col items-center py-8 text-center">
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-red-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-[#F23030] rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-lg font-black text-[#1A1A1A] mb-2">Identidade do Mano</p>
          <p className="text-slate-500 mb-4">Estamos a validar os seus dados e documentos na banda...</p>
          <p className="text-xs text-[#D9A441] font-black uppercase tracking-widest">Segurança da Banda</p>
        </div>
      </motion.div>
    </div>
  );
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isBusinessSignup, setIsBusinessSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = isBusinessSignup ? 4 : 5;

  const validateField = (name: string, value: string) => {
    if (!value) return 'Campo obrigatório';
    switch (name) {
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email inválido';
      case 'phone': return /^9\d{8}$/.test(value) ? '' : 'Telemóvel deve ter 9 dígitos e começar com 9';
      case 'bi_number': return /^\d{9}[A-Z]{2}\d{3}$/.test(value) ? '' : 'Formato inválido (ex: 000000000LA000)';
      case 'pin': return /^\d{4}$/.test(value) ? '' : 'PIN deve ter 4 dígitos';
      case 'account_number': return value.length >= 10 ? '' : 'Número de conta inválido';
      default: return '';
    }
  };

  const updateFormData = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep < totalSteps) {
      setSignupStep(signupStep + 1);
      return;
    }
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: isBusinessSignup ? 'business' : 'individual' }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsVerifying(true);
      } else {
        alert(data.error || 'Erro ao cadastrar');
      }
    } catch {
      alert('Erro de conexão com o servidor');
    }
  };

  const completeSignup = async () => {
    setIsVerifying(false);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.email || formData.phone,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (signupStep > 1) {
      setSignupStep(signupStep - 1);
    } else if (isBusinessSignup) {
      setIsBusinessSignup(false);
      setSignupStep(1);
    } else {
      navigate('/login');
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
      <label className="block text-[10px] font-black text-[#F23030] uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2ED]">
      <div className="p-8 pt-12 flex-1 overflow-y-auto max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBack} className="p-2 bg-white rounded-full shadow-sm border border-black/5">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-black">{isBusinessSignup ? 'Cadastro Empresarial' : 'Cadastro de Mano'}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passo {signupStep} de {totalSteps}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Icon + progress */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#F23030] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/20">
            {isBusinessSignup ? <Building2 size={32} className="text-white" /> : <User size={32} className="text-white" />}
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1A] text-center leading-tight">
            {isBusinessSignup ? 'Dados da Empresa' : 'Dados do Mano'}
          </h1>
          <div className="flex gap-1 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={cn('h-1 rounded-full transition-all', i + 1 <= signupStep ? 'w-6 bg-[#F23030]' : 'w-2 bg-slate-200')} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* ── INDIVIDUAL ── */}
          {!isBusinessSignup && (
            <>
              {signupStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dados Pessoais</h3>
                  <Field label="Nome Completo">
                    <input type="text" required value={formData.name || ''} onChange={(e) => updateFormData('name', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: Manuel dos Santos" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Nascimento">
                      <input type="date" required value={formData.birth_date || ''} onChange={(e) => updateFormData('birth_date', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input bg-transparent" />
                    </Field>
                    <Field label="Sexo">
                      <select required value={formData.gender || ''} onChange={(e) => updateFormData('gender', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input bg-transparent">
                        <option value="">Selecionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Nº do Bilhete (BI)">
                    <input type="text" required value={formData.bi_number || ''} onChange={(e) => updateFormData('bi_number', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="000000000LA000" />
                    {errors.bi_number && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.bi_number}</p>}
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Emissão">
                      <input type="date" required value={formData.emission_date || ''} onChange={(e) => updateFormData('emission_date', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input bg-transparent" />
                    </Field>
                    <Field label="Nacionalidade">
                      <input type="text" required value={formData.nationality || ''} onChange={(e) => updateFormData('nationality', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Angolana" />
                    </Field>
                  </div>
                </div>
              )}

              {signupStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dados de Contacto</h3>
                  <Field label="Telemóvel">
                    <input type="tel" required value={formData.phone || ''} onChange={(e) => updateFormData('phone', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="9xx xxx xxx" />
                    {errors.phone && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.phone}</p>}
                  </Field>
                  <Field label="Email">
                    <input type="email" required value={formData.email || ''} onChange={(e) => updateFormData('email', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="email@exemplo.com" />
                    {errors.email && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.email}</p>}
                  </Field>
                  <Field label="Endereço Residencial">
                    <input type="text" required value={formData.address || ''} onChange={(e) => updateFormData('address', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Bairro, Rua..." />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Município">
                      <input type="text" required value={formData.municipality || ''} onChange={(e) => updateFormData('municipality', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: Belas" />
                    </Field>
                    <Field label="Província">
                      <input type="text" required value={formData.province || ''} onChange={(e) => updateFormData('province', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: Luanda" />
                    </Field>
                  </div>
                </div>
              )}

              {signupStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dados Profissionais</h3>
                  <Field label="Profissão">
                    <input type="text" required value={formData.profession || ''} onChange={(e) => updateFormData('profession', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: Professor" />
                  </Field>
                  <Field label="Local de Trabalho">
                    <input type="text" required value={formData.workplace || ''} onChange={(e) => updateFormData('workplace', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Nome da Empresa" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Tempo de Serviço">
                      <input type="number" required value={formData.service_time || ''} onChange={(e) => updateFormData('service_time', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Anos" />
                    </Field>
                    <Field label="Renda Mensal (Kz)">
                      <input type="number" required value={formData.monthly_income || ''} onChange={(e) => updateFormData('monthly_income', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="0" />
                    </Field>
                  </div>
                </div>
              )}

              {signupStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dados Bancários</h3>
                  <Field label="Banco">
                    <input type="text" required value={formData.bank || ''} onChange={(e) => updateFormData('bank', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: BFA" />
                  </Field>
                  <Field label="Nº de Conta ou IBAN">
                    <input type="text" required value={formData.account_number || ''} onChange={(e) => updateFormData('account_number', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="AO06 0000 0000 ..." />
                  </Field>
                </div>
              )}

              {signupStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Acesso e Finalização</h3>
                  <Field label="Palavra-passe">
                    <input type="password" required minLength={8} value={formData.password || ''} onChange={(e) => updateFormData('password', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="••••••••" />
                  </Field>
                  <Field label="Confirmar Palavra-passe">
                    <input type="password" required value={formData.confirm_password || ''} onChange={(e) => updateFormData('confirm_password', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="••••••••" />
                    {formData.password && formData.confirm_password && formData.password !== formData.confirm_password && (
                      <p className="text-[9px] text-red-500 mt-1 font-bold">As senhas não coincidem</p>
                    )}
                  </Field>
                  <Field label="PIN de Segurança (4 dígitos)">
                    <input type="password" maxLength={4} required value={formData.pin || ''} onChange={(e) => updateFormData('pin', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="••••" />
                    {errors.pin && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.pin}</p>}
                  </Field>
                  <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center gap-3">
                    <input type="checkbox" required className="w-5 h-5 accent-[#F23030]" />
                    <p className="text-[10px] font-medium text-slate-600">
                      Aceito os{' '}
                      <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#F23030] font-black hover:underline">Termos e Condições</button>
                      {' '}e a <span className="text-[#F23030] font-black">Política de Privacidade</span>.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── EMPRESARIAL ── */}
          {isBusinessSignup && (
            <>
              {signupStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Informações Institucionais</h3>
                  <Field label="Nome da Empresa">
                    <input type="text" required value={formData.name || ''} onChange={(e) => updateFormData('name', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: Kixikila Tech Lda" />
                  </Field>
                  <Field label="Tipo de Empresa">
                    <input type="text" required value={formData.company_type || ''} onChange={(e) => updateFormData('company_type', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: Sociedade Unipessoal" />
                  </Field>
                  <Field label="NIF da Empresa">
                    <input type="text" required value={formData.bi_number || ''} onChange={(e) => updateFormData('bi_number', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="5000000000" />
                  </Field>
                </div>
              )}
              {signupStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contactos</h3>
                  <Field label="Telefone">
                    <input type="tel" required value={formData.phone || ''} onChange={(e) => updateFormData('phone', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="9xx xxx xxx" />
                  </Field>
                  <Field label="Email Institucional">
                    <input type="email" required value={formData.email || ''} onChange={(e) => updateFormData('email', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="empresa@exemplo.com" />
                  </Field>
                </div>
              )}
              {signupStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dados Financeiros</h3>
                  <Field label="Banco">
                    <input type="text" required value={formData.bank || ''} onChange={(e) => updateFormData('bank', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="Ex: BIC" />
                  </Field>
                  <Field label="Nº de Conta ou IBAN">
                    <input type="text" required value={formData.account_number || ''} onChange={(e) => updateFormData('account_number', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="AO06 0000 0000 ..." />
                  </Field>
                </div>
              )}
              {signupStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Acesso</h3>
                  <Field label="Palavra-passe">
                    <input type="password" required minLength={8} value={formData.password || ''} onChange={(e) => updateFormData('password', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="••••••••" />
                  </Field>
                  <Field label="PIN de Segurança">
                    <input type="password" maxLength={4} required value={formData.pin || ''} onChange={(e) => updateFormData('pin', e.target.value)} className="w-full font-bold focus:outline-none no-animation-input" placeholder="••••" />
                  </Field>
                  <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center gap-3">
                    <input type="checkbox" required className="w-5 h-5 accent-[#F23030]" />
                    <p className="text-[10px] font-medium text-slate-600">
                      Aceitamos os{' '}
                      <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#F23030] font-black hover:underline">Termos e Condições</button>
                      {' '}da plataforma.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* segurança + botão */}
          <div className="bg-[#D9A441]/10 p-5 rounded-3xl border border-[#D9A441]/20 flex gap-4">
            <div className="w-10 h-10 bg-[#D9A441] rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-[#1A1A1A] mb-1">Segurança Garantida</p>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">Os teus dados são encriptados e nunca partilhados.</p>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary mt-4 flex items-center justify-center gap-3">
            {signupStep === totalSteps ? 'FINALIZAR CADASTRO' : 'PRÓXIMO PASSO'} <ChevronRight size={20} />
          </button>

          {signupStep === 1 && !isBusinessSignup && (
            <button
              type="button"
              onClick={() => { setIsBusinessSignup(true); setSignupStep(1); setFormData({}); }}
              className="w-full py-4 bg-white border-2 border-[#D9A441] text-[#D9A441] font-black rounded-2xl uppercase tracking-widest text-xs mt-2"
            >
              Conta Empresarial
            </button>
          )}
        </form>
      </div>

      <VerificationModal isOpen={isVerifying} onComplete={completeSignup} />

      {/* Modal Termos */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] shadow-xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Termos e Condições</h3>
                <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{TERMS_TEXT}</p>
                <button onClick={() => setShowTermsModal(false)} className="w-full btn-primary mt-8">ENTENDI</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};