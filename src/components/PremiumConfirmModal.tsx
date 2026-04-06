import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert, Loader2 } from 'lucide-react';

interface PremiumConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isDeleting?: boolean;
}

export function PremiumConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  itemName,
  isDeleting = false
}: PremiumConfirmModalProps) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleNextStep = () => {
    setStep(2);
  };

  const handleConfirm = () => {
    onConfirm();
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1C2E4A]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Progress Bar (2 steps) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex gap-1 p-1 bg-slate-50">
          <div className={`flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-error' : 'bg-slate-200'}`} />
          <div className={`flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-error animate-pulse' : 'bg-slate-200'}`} />
        </div>

        <div className="p-8 md:p-10 pt-10 text-center">
          {/* Header Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse ${step === 1 ? 'bg-warning' : 'bg-error'}`} />
            <div className={`relative w-full h-full rounded-3xl flex items-center justify-center border-2 transition-colors duration-500 ${
              step === 1 ? 'bg-warning/10 border-warning/20 text-warning' : 'bg-error/10 border-error/20 text-error'
            }`}>
              {step === 1 ? <AlertTriangle size={40} strokeWidth={2.5} /> : <ShieldAlert size={40} strokeWidth={2.5} />}
            </div>
          </div>

          <h3 className={`text-2xl font-black tracking-tight mb-3 transition-colors duration-500 ${step === 1 ? 'text-slate-900' : 'text-error'}`}>
            {step === 1 ? title : 'Confirmação Final'}
          </h3>
          
          <div className="space-y-4 mb-10">
            <p className="text-slate-500 font-medium leading-relaxed">
              {step === 1 ? description : 'Esta ação não poderá ser desfeita. Todos os dados vinculados a este registro serão removidos permanentemente.'}
            </p>
            
            {itemName && (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Item selecionado</span>
                <span className="text-sm font-bold text-slate-700">{itemName}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {step === 1 ? (
              <button 
                onClick={handleNextStep}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                Continuar para exclusão
              </button>
            ) : (
              <button 
                onClick={onConfirm}
                disabled={isDeleting}
                className="w-full bg-error text-white rounded-2xl py-5 font-black uppercase tracking-[0.25em] text-xs transition-all shadow-xl shadow-error/20 hover:bg-error/90 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} strokeWidth={3} />
                )}
                {isDeleting ? 'Excluindo...' : 'Confirmar e Excluir agora'}
              </button>
            )}
            
            <button 
              onClick={handleClose}
              className="w-full bg-white text-slate-400 hover:text-slate-600 rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs transition-all border border-slate-100"
            >
              Cancelar
            </button>
          </div>
        </div>

        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 rounded-xl transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
