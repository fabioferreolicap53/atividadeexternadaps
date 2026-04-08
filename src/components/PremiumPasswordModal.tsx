import React, { useState, useEffect } from 'react';
import { Lock, X, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface PremiumPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel?: string;
}

export function PremiumPasswordModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel = 'Confirmar Operação'
}: PremiumPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Limpa o estado ao fechar/abrir
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
      setIsVerifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Simulação de delay para manter a experiência premium
    setTimeout(() => {
      // A senha é a mesma do login (visto no Login.tsx)
      if (password === 'daps2022') {
        onConfirm();
        onClose();
      } else {
        setError('Senha incorreta. Verifique suas credenciais de acesso.');
        setIsVerifying(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop com Glassmorphism pesado */}
      <div 
        className="absolute inset-0 bg-[#1C2E4A]/90 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_32px_120px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Header Decorativo */}
        <div className="h-24 bg-brand-dark relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative z-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md">
            <ShieldCheck className="text-white" size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="p-8 md:p-10 text-center">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
            {title}
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            {description}
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-error' : 'text-slate-300 group-focus-within:text-brand-dark'}`} size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 outline-none transition-all font-bold text-sm ${
                    error ? 'border-error/30 bg-error/5 focus:border-error' : 'border-slate-100 focus:border-brand-dark focus:bg-white'
                  }`}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 mt-2 ml-1 animate-in slide-in-from-top-1">
                  <AlertCircle size={12} className="text-error" />
                  <span className="text-[10px] font-bold text-error uppercase tracking-tight">{error}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button 
                type="submit"
                disabled={isVerifying || !password}
                className="w-full bg-brand-dark text-white rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-brand-dark/20 hover:bg-brand-dark/90 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {actionLabel}
                    <ArrowRight size={16} strokeWidth={3} />
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full bg-white text-slate-400 hover:text-slate-600 rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs transition-all border border-slate-100"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white rounded-xl transition-colors z-20"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
