import React from 'react';
import { 
  X, 
  User, 
  HeartPulse, 
  PlaneTakeoff, 
  ArrowRight,
  Info,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Briefcase
} from 'lucide-react';

interface Activity {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  professionalIds: string[];
}

interface ProfessionalStatus {
  id: string;
  name: string;
  role: string;
  careLines: string[];
  status: 'present' | 'absent' | 'on-duty';
  reason?: string;
  currentActivity?: Activity;
  allDailyActivities?: Activity[];
}

interface PremiumProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: ProfessionalStatus | null;
  careLines: any[];
}

export function PremiumProfessionalModal({ 
  isOpen, 
  onClose, 
  professional,
  careLines
}: PremiumProfessionalModalProps) {
  if (!isOpen || !professional) return null;

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
                <User size={14} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Perfil e Status Atual</span>
            </div>
            <h3 className="text-xl md:text-3xl font-black text-white font-headline tracking-tight leading-tight">
              {professional.name}
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
          
          {/* Status Banner */}
          <div className={`rounded-3xl p-6 border flex items-center justify-between gap-4 transition-all duration-500 shadow-sm ${
            professional.status === 'absent' 
              ? 'bg-error/5 border-error/10 text-error' 
              : professional.currentActivity 
              ? 'bg-primary/5 border-primary/10 text-primary'
              : 'bg-warning/5 border-warning/10 text-warning'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${
                professional.status === 'absent' ? 'bg-error' : professional.currentActivity ? 'bg-primary' : 'bg-warning'
              }`}>
                {professional.status === 'absent' ? <HeartPulse size={24} strokeWidth={2.5} /> : <Briefcase size={24} strokeWidth={2.5} />}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Status de Disponibilidade</p>
                <p className="text-base font-black leading-tight uppercase tracking-tight">
                  {professional.status === 'absent' ? (professional.reason || 'Ausente') : professional.currentActivity ? 'Atividade Externa' : 'Viagem Técnica'}
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                professional.status === 'absent' ? 'bg-error/10 border-error/20' : professional.currentActivity ? 'bg-primary/10 border-primary/20' : 'bg-warning/10 border-warning/20'
              }`}>
                {professional.status === 'absent' ? 'Atenção' : 'Em Campo'}
              </span>
            </div>
          </div>

          {/* Professional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="w-12 h-12 bg-brand-dark/5 rounded-xl flex items-center justify-center text-brand-dark shrink-0 border border-brand-dark/10 group-hover:bg-brand-dark group-hover:text-white transition-all">
                <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cargo / Função</p>
                <p className="text-sm font-black text-slate-900 leading-tight">{professional.role}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                <Info size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Linhas de Cuidado</p>
                <div className="flex flex-wrap gap-1.5">
                  {professional.careLines && professional.careLines.length > 0 ? (
                    professional.careLines.map(lineId => {
                      const line = careLines.find(l => l.id === lineId);
                      return line ? (
                        <span key={line.id} className="text-[10px] font-black text-primary uppercase tracking-tight bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                          {line.name}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <p className="text-sm font-black text-slate-900 leading-tight">Geral</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Schedule / Activities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-400" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Agenda Externa (Hoje)</h4>
              </div>
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                {professional.allDailyActivities?.length || 0} Registros
              </span>
            </div>

            <div className="space-y-3">
              {professional.allDailyActivities && professional.allDailyActivities.length > 0 ? (
                professional.allDailyActivities.map((act) => (
                  <div key={act.id} className={`p-5 rounded-3xl border transition-all relative overflow-hidden group ${
                    professional.currentActivity?.id === act.id 
                      ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' 
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}>
                    {professional.currentActivity?.id === act.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                    )}
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className={professional.currentActivity?.id === act.id ? 'text-primary' : 'text-slate-400'} />
                        <h5 className={`font-bold text-sm ${professional.currentActivity?.id === act.id ? 'text-primary' : 'text-slate-900'}`}>
                          {act.description}
                        </h5>
                      </div>
                      {professional.currentActivity?.id === act.id && (
                        <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">Agora</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">{act.startTime} - {act.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">{act.location}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50/50 p-8 rounded-[32px] border border-dashed border-slate-200 text-center">
                  <p className="text-slate-400 font-medium italic text-sm">Nenhuma atividade externa para hoje.</p>
                </div>
              )}
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
