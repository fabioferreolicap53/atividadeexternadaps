import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  TrendingUp,
  Activity as ActivityIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  MapPin,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { Timeline } from '../components/Timeline';
import { RightSidebar } from '../components/RightSidebar';
import { PremiumDetailModal } from '../components/PremiumDetailModal';
import { PremiumProfessionalModal } from '../components/PremiumProfessionalModal';

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
  careLine?: string;
}

interface ProfessionalStatus extends Professional {
  status: 'present' | 'absent' | 'on-duty';
  reason?: string;
  currentActivity?: Activity;
  allDailyActivities?: Activity[];
}

interface DashboardProps {
  activities: Activity[];
  professionals: Professional[];
}

export function Dashboard({ activities: ACTIVITIES_MOCK, professionals: PROFESSIONALS_MOCK }: DashboardProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalStatus | null>(null);
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);

  // Mapear profissionais para o estado de presença (TEAM_STATUS) dinamicamente
  const TEAM_STATUS: ProfessionalStatus[] = PROFESSIONALS_MOCK.map(prof => {
    // Todos os profissionais agora iniciam como 'present'
    // As ausências serão determinadas APENAS pelas atividades externas em tempo real
    return {
      ...prof,
      status: 'present',
      reason: ''
    };
  });

  const handleOpenDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleOpenProfDetail = (professional: ProfessionalStatus) => {
    setSelectedProfessional(professional);
    setIsProfModalOpen(true);
  };

  const presentCount = TEAM_STATUS.filter(p => p.status === 'present').length;
  const onDutyCount = TEAM_STATUS.filter(p => p.status === 'on-duty').length;
  const absentCount = TEAM_STATUS.filter(p => p.status === 'absent').length;
  const totalCount = TEAM_STATUS.length;
  const presenceRate = Math.round(((presentCount + onDutyCount) / totalCount) * 100);

  // Lógica para determinar quem está ausente agora com base em atividades externas
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const currentDate = now.toISOString().split('T')[0];

  // Ordenar atividades do dia para a Timeline
  const dailyActivities = ACTIVITIES_MOCK
    .filter(a => a.date === currentDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Formatação da data por extenso em Português
  const formattedDate = now.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    weekday: 'long' 
  }).replace(/^\w/, (c) => c.toUpperCase());

  const professionalsWithActivity = TEAM_STATUS.map(prof => {
    const dailyActivities = ACTIVITIES_MOCK.filter(act => 
      act.professionalIds.includes(prof.id) && 
      act.date === currentDate
    );
    
    const activeActivity = dailyActivities.find(act => 
      currentTime >= act.startTime && 
      currentTime <= act.endTime
    );

    return { 
      ...prof, 
      currentActivity: activeActivity,
      allDailyActivities: dailyActivities 
    };
  });

  // Filtra APENAS quem está em atividade externa AGORA
  const currentlyAbsentProfessionals = professionalsWithActivity.filter(p => 
    p.currentActivity
  );

  const currentlyAbsentCount = currentlyAbsentProfessionals.length;

  // Para o contador de ausências totais do dia (se houver atividade planejada em qualquer horário)
  const allDailyAbsencesCount = professionalsWithActivity.filter(p => 
    p.allDailyActivities!.length > 0
  ).length;

  return (
    <div className="p-4 md:p-8 space-y-8 md:space-y-12 flex-1 animate-in fade-in duration-500 overflow-x-hidden">
      {/* Hero Heading Section */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-10">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-3 text-primary-light font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
            Visão Geral em Tempo Real
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-on-surface leading-[1.1]">
            Resumo do <span className="text-primary">Dia</span>
          </h2>
          <p className="text-on-surface-variant font-medium text-base md:text-lg leading-relaxed">
            {formattedDate} • <span className="text-primary font-bold">{ACTIVITIES_MOCK.filter(a => a.date === currentDate).length} atividades</span> planejadas
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 md:gap-4 w-full xl:w-auto">
          {/* Ausências Card */}
          <div className="bg-brand-dark p-5 md:p-7 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col items-center justify-center min-w-[140px] md:min-w-[200px] group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden flex-1">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-error/10 rounded-full blur-2xl group-hover:bg-error/20 transition-all duration-700"></div>
            
            <div className="flex items-center gap-4 mb-3 relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/[0.03] rounded-[18px] flex items-center justify-center border border-white/10 group-hover:border-error/50 transition-all duration-500 shadow-inner">
                <UserX size={22} strokeWidth={2.5} className="text-white group-hover:text-error transition-colors" />
              </div>
              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-xl">
                {String(allDailyAbsencesCount).padStart(2, '0')}
              </span>
            </div>
            
            <span className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.25em] text-center relative z-10 group-hover:text-white transition-colors">
              Ausências do Dia
            </span>
          </div>
          
          {/* Ausentes Agora Card */}
          <div className="bg-brand-dark p-5 md:p-7 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col items-center justify-center min-w-[140px] md:min-w-[200px] group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden flex-1">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-warning/10 rounded-full blur-2xl group-hover:bg-warning/20 transition-all duration-700"></div>
            
            <div className="flex items-center gap-4 mb-3 relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/[0.03] rounded-[18px] flex items-center justify-center border border-white/10 group-hover:border-warning/50 transition-all duration-500 shadow-inner">
                <Clock size={22} strokeWidth={2.5} className="text-white group-hover:text-warning transition-colors" />
              </div>
              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-xl">
                {String(currentlyAbsentCount).padStart(2, '0')}
              </span>
            </div>
            
            <span className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.25em] text-center relative z-10 group-hover:text-white transition-colors">
              Ausentes Agora
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6 md:gap-8 pt-4">
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <Timeline 
            onActivityClick={handleOpenDetail} 
            activities={dailyActivities}
          />
        </div>
        
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <RightSidebar 
            absentProfessionals={currentlyAbsentProfessionals} 
            onActivityClick={handleOpenDetail}
            onProfessionalClick={handleOpenProfDetail}
          />
        </div>
      </div>

      <PremiumDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        activity={selectedActivity}
        professionals={PROFESSIONALS_MOCK}
      />

      <PremiumProfessionalModal 
        isOpen={isProfModalOpen}
        onClose={() => setIsProfModalOpen(false)}
        professional={selectedProfessional}
      />
    </div>
  );
}
