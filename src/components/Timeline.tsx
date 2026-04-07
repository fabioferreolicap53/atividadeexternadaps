import { Clock, AlertTriangle, Users, MapPin } from 'lucide-react';

interface Activity {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  professionalIds: string[];
}

interface Professional {
  id: string;
  name: string;
  role: string;
  careLines: string[];
}

interface TimelineProps {
  onActivityClick?: (activity: Activity) => void;
  activities: Activity[];
  professionals: Professional[];
  careLines: any[];
}

export function Timeline({ onActivityClick, activities, professionals, careLines }: TimelineProps) {
  // Ordenar atividades por horário de início
  const sortedActivities = [...activities].sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Lógica para determinar status da atividade (simplificada)
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="bg-brand-dark p-4 sm:p-5 md:p-7 rounded-[28px] sm:rounded-[32px] shadow-2xl shadow-black/20 border border-white/5 relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-white/10 text-white rounded-lg border border-white/20">
            <Clock size={16} sm:size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-xs sm:text-sm md:text-base font-black font-headline text-white uppercase tracking-tight">
            Fluxo de Atividades
          </h3>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="timeline-ruler relative space-y-8 sm:space-y-12 pl-12 sm:pl-14 md:pl-24 pr-1 sm:pr-2 md:pr-10 pb-4 before:content-[''] before:absolute before:left-5 sm:left-6 md:left-10 before:top-0 before:bottom-0 before:w-[2px] before:bg-white/20 before:shadow-[0_0_10px_rgba(255,255,255,0.1)] after:content-[''] after:absolute after:left-5 sm:after:left-6 md:after:left-10 after:top-0 after:bottom-0 after:w-[10px] after:-ml-[4px] after:bg-primary/10 after:blur-xl">
        
        {sortedActivities.map((activity, index) => {
          const isActive = currentTime >= activity.startTime && currentTime <= activity.endTime;
          const isPast = currentTime > activity.endTime;
          
          return (
            <div key={activity.id} className={`relative group ${isPast ? 'opacity-40 grayscale-[0.8]' : ''}`}>
              <div className="absolute -left-12 sm:-left-14 md:-left-24 top-0 flex flex-col items-center">
                <span className={`text-xs sm:text-sm md:text-lg font-black tracking-tighter transition-all duration-500 ${
                  isActive 
                    ? 'text-white scale-110 sm:scale-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                    : 'text-white/80 group-hover:text-white'
                }`}>
                  {activity.startTime}
                </span>
                <div className="relative mt-2 sm:mt-3 z-10 flex items-center justify-center">
                  {/* Outer Glow Ring for Active */}
                  {isActive && (
                    <div className="absolute w-10 h-10 sm:w-12 h-12 bg-primary/30 rounded-full animate-ping" />
                  )}
                  {isActive && (
                    <div className="absolute w-7 h-7 sm:w-8 h-8 border-2 border-white/40 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  )}
                  
                  <div className={`w-3 h-3 sm:w-4 h-4 md:w-6 md:h-6 rounded-full border-[2px] sm:border-[3px] transition-all duration-500 ${
                    isActive 
                      ? 'bg-white border-primary scale-110 sm:scale-125 shadow-[0_0_25px_rgba(255,255,255,0.9)]' 
                      : isPast 
                      ? 'bg-brand-dark border-white/10'
                      : 'bg-brand-dark border-white/60 group-hover:border-white shadow-lg'
                  }`}>
                    {isActive && <div className="w-full h-full bg-primary rounded-full scale-[0.3] animate-pulse" />}
                  </div>
                </div>
              </div>
              
              <div 
                onClick={() => onActivityClick?.(activity)}
                className={`p-4 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] border transition-all duration-500 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-8 w-full relative overflow-hidden ${
                  isActive 
                    ? 'bg-white/[0.12] border-primary/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-[1.02] sm:scale-[1.03] z-20' 
                    : 'bg-white/[0.04] border-white/5 group-hover:border-primary/30 group-hover:bg-white/[0.08] group-hover:scale-[1.01]'
                }`}
              >
                {/* Active Accent Gradient */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
                )}
                
                <div className="flex-1 space-y-3 sm:space-y-4 relative z-10">
                  <h4 className={`font-black text-sm sm:text-base md:text-2xl transition-all duration-500 leading-tight ${isActive ? 'text-white drop-shadow-md' : 'text-white/80 group-hover:text-white'}`}>
                    {activity.description}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[9px] sm:text-[11px] md:text-xs text-white/50 font-bold uppercase tracking-widest transition-all duration-500">
                    <span className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border transition-all duration-500 ${isActive ? 'bg-primary/10 border-primary/20 text-primary-light' : 'bg-white/5 border-white/5'}`}>
                      <Clock size={14} className={isActive ? 'text-primary-light' : 'text-white/30'} /> 
                      {activity.startTime} — {activity.endTime}
                    </span>
                    <span className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border transition-all duration-500 ${isActive ? 'bg-primary/10 border-primary/20 text-primary-light' : 'bg-white/5 border-white/5'}`}>
                      <MapPin size={14} className={isActive ? 'text-primary-light' : 'text-white/30'} /> 
                      <span className="truncate max-w-[100px] sm:max-w-none">{activity.location}</span>
                    </span>
                    <span className={`flex items-start gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border transition-all duration-500 ${isActive ? 'bg-primary/10 border-primary/20 text-primary-light' : 'bg-white/5 border-white/5'}`}>
                      <Users size={14} className={`mt-1 ${isActive ? 'text-primary-light' : 'text-white/30'}`} /> 
                      <div className="flex flex-col gap-1.5">
                        {activity.professionalIds.map((id, i) => {
                          const prof = professionals.find(p => p.id === id);
                          if (!prof) return null;
                          
                          return (
                            <div key={id} className="flex flex-col">
                              <span className={`text-[10px] sm:text-xs font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-white/80'}`}>
                                {prof.name}
                              </span>
                              {prof.careLines && prof.careLines.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {prof.careLines.map(lineId => {
                                    const line = careLines.find(l => l.id === lineId);
                                    return line ? (
                                      <span key={lineId} className="text-[7px] sm:text-[8px] font-bold opacity-60 italic uppercase tracking-tighter leading-none">
                                        {line.name}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-start md:justify-end min-w-0 md:min-w-[140px] relative z-10">
                  {isActive ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative group/badge">
                        <span className="relative text-yellow-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                          Em Andamento
                        </span>
                      </div>
                    </div>
                  ) : !isPast ? (
                    <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 hover:bg-primary hover:text-white text-white/70 rounded-xl sm:rounded-2xl border border-white/10 transition-all duration-300 shadow-md group/btn cursor-pointer">
                      <Users size={14} className="text-white/30 group-hover/btn:text-white transition-colors" />
                      <span className="text-[9px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">Ver Equipe</span>
                    </div>
                  ) : (
                    <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Concluído</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {sortedActivities.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-white/30 font-medium italic text-sm">Nenhuma atividade planejada para este horário.</p>
          </div>
        )}
      </div>
    </div>
  );
}
