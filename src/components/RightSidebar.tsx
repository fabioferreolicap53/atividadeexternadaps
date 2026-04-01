import { HeartPulse, FileText, PlaneTakeoff, ArrowRight, AlertCircle, Info, User, Sparkles, MapPin, Clock } from 'lucide-react';

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
  status: 'present' | 'absent' | 'on-duty';
  reason?: string;
  currentActivity?: Activity;
  allDailyActivities?: Activity[];
}

interface RightSidebarProps {
  absentProfessionals?: ProfessionalStatus[];
  onActivityClick?: (activity: Activity) => void;
  onProfessionalClick?: (professional: ProfessionalStatus) => void;
}

export function RightSidebar({ absentProfessionals = [], onActivityClick, onProfessionalClick }: RightSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Absent Professionals Card */}
      <div className="bg-brand-dark p-5 md:p-7 rounded-[32px] shadow-2xl shadow-black/20 border border-white/5 space-y-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm md:text-base font-black font-headline text-white uppercase tracking-tight">AUSÊNCIAS AGORA</h3>
          </div>
          <div className="relative flex items-center justify-center">
            <span className="relative text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-error rounded-full animate-ping shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              Atenção
            </span>
          </div>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {absentProfessionals.map((prof) => (
            <div key={prof.id} className="bg-white/[0.05] p-4 rounded-2xl border border-white/10 group hover:border-error/40 transition-all duration-300">
              <div 
                className="flex items-start gap-3 cursor-pointer group/card"
                onClick={() => onProfessionalClick?.(prof)}
              >
                <div className="relative shrink-0 group-hover/card:scale-105 transition-transform duration-500">
                  <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-white group-hover/card:bg-white/10 transition-colors duration-500 bg-primary/20 border-primary/30">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-xs truncate group-hover/card:text-primary-light transition-colors">{prof.name}</h4>
                  <p className="text-[9px] text-white/80 font-medium uppercase tracking-wider mt-0.5">{prof.role}</p>
                </div>
              </div>

              {/* Fluxo de Atividades do Dia para este profissional */}
              {prof.allDailyActivities && prof.allDailyActivities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[8px] text-white/50 font-black uppercase tracking-widest">Agenda Externa (Hoje):</p>
                  <div className="space-y-1.5">
                    {prof.allDailyActivities.map((act) => (
                      <div 
                        key={act.id} 
                        onClick={() => onActivityClick?.(act)}
                        className={`px-2.5 py-2 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                          prof.currentActivity?.id === act.id 
                            ? 'bg-primary/20 border-primary/40 shadow-[0_0_10px_rgba(0,72,141,0.2)]' 
                            : 'bg-white/[0.03] border-white/5 opacity-60 hover:opacity-100 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className={prof.currentActivity?.id === act.id ? 'text-white' : 'text-white/60'} size={11} strokeWidth={2.5} />
                            <span className={`text-[10px] font-bold truncate ${prof.currentActivity?.id === act.id ? 'text-white' : 'text-white/80'}`}>
                              {act.description}
                            </span>
                          </div>
                          {prof.currentActivity?.id === act.id && (
                            <div className="shrink-0 relative flex items-center justify-center">
                              <span className="relative text-yellow-100 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1">
                                <div className="w-1 h-1 bg-[#22c55e] rounded-full animate-ping shadow-[0_0_8px_#22c55e]" />
                                Agora
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <MapPin className={prof.currentActivity?.id === act.id ? 'text-white/70' : 'text-white/40'} size={9} strokeWidth={2.5} />
                            <span className={`text-[8px] font-medium ${prof.currentActivity?.id === act.id ? 'text-white/80' : 'text-white/50'}`}>{act.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className={prof.currentActivity?.id === act.id ? 'text-white/70' : 'text-white/40'} size={9} strokeWidth={2.5} />
                            <span className={`text-[8px] font-medium ${prof.currentActivity?.id === act.id ? 'text-white/80' : 'text-white/50'}`}>{act.startTime} - {act.endTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {absentProfessionals.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-white/40 text-sm font-medium italic">Nenhum profissional ausente no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
