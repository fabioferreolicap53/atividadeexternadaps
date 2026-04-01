import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  ArrowRight,
  User,
  Info
} from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  role: string;
  careLine?: string;
}

interface Activity {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  professionalIds: string[];
}

interface PremiumDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  professionals: Professional[];
}

export function PremiumDetailModal({ 
  isOpen, 
  onClose, 
  activity, 
  professionals 
}: PremiumDetailModalProps) {
  if (!isOpen || !activity) return null;

  const activityProfessionals = activity.professionalIds
    .map(pid => professionals.find(p => p.id === pid))
    .filter(Boolean) as Professional[];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop with Glassmorphism */}
      <div 
        className="absolute inset-0 bg-[#1C2E4A]/60 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-[0_32px_120px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col max-h-[90vh]">
        
        {/* Header with Visual Accent */}
        <div className="relative h-32 md:h-40 bg-brand-dark overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />
          
          <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
            <div className="flex items-center gap-3 text-white/50 mb-2">
              <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
                <Info size={14} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Detalhamento da Atividade</span>
            </div>
            <h3 className="text-xl md:text-3xl font-black text-white font-headline tracking-tight leading-tight">
              {activity.description}
            </h3>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-300 border border-white/10 z-10"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 space-y-8">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data & Hora */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Calendar size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data e Horário</p>
                <p className="text-base font-black text-slate-900 leading-tight">
                  {activity.date.split('-').reverse().join('/')}
                </p>
                <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-1.5">
                  <Clock size={14} /> {activity.startTime} — {activity.endTime}
                </p>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <MapPin size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Localização</p>
                <p className="text-base font-black text-slate-900 leading-tight">{activity.location}</p>
                <p className="text-sm font-bold text-slate-500 mt-1 italic">Atividade Externa</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-slate-400" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Descrição Completa</h4>
            </div>
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 relative">
              <div className="absolute top-4 right-6 text-slate-200">
                <Sparkles size={40} />
              </div>
              <p className="text-slate-600 font-medium leading-relaxed relative z-10">
                {activity.description}. Atividade planejada para execução externa com foco no cumprimento dos protocolos institucionais e excelência no atendimento.
              </p>
            </div>
          </div>

          {/* Professionals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-slate-400" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Equipe Responsável</h4>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                {activityProfessionals.length} {activityProfessionals.length === 1 ? 'Membro' : 'Membros'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activityProfessionals.map((prof) => (
                <div key={prof.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 hover:border-primary/30 transition-all duration-300 shadow-sm group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{prof.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{prof.role}</p>
                    {prof.careLine && (
                      <p className="text-[8px] font-bold text-primary/60 italic truncate mt-0.5">{prof.careLine}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-10 pt-0 bg-white shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-2xl py-5 font-black uppercase tracking-[0.25em] text-[10px] md:text-xs transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
          >
            Fechar Detalhes
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { Sparkles } from 'lucide-react';
