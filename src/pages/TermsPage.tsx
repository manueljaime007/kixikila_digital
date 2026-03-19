import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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

export const TermsPage = () => {
  const navigate = useNavigate();

  return (
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
            onClick={() => navigate("/login")}
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
};
