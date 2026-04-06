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
  FileText,
  CalendarDays
} from 'lucide-react';
import { useState } from 'react';
import { Timeline } from '../components/Timeline';
import { RightSidebar } from '../components/RightSidebar';
import { PremiumDetailModal } from '../components/PremiumDetailModal';
import { PremiumProfessionalModal } from '../components/PremiumProfessionalModal';
import { PremiumDatePicker } from '../components/PremiumSelect';

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
  
  // Estado para a data selecionada
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

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
  const isToday = selectedDate === now.toISOString().split('T')[0];

  // Ordenar atividades do dia para a Timeline
  const dailyActivities = ACTIVITIES_MOCK
    .filter(a => a.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Formatação da data por extenso em Português
  const dateObj = new Date(selectedDate + 'T12:00:00');
  const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());
  const dayAndMonth = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

  const professionalsWithActivity = TEAM_STATUS.map(prof => {
    const dailyActivities = ACTIVITIES_MOCK.filter(act => 
      act.professionalIds.includes(prof.id) && 
      act.date === selectedDate
    );
    
    const activeActivity = dailyActivities.find(act => 
      currentTime >= act.startTime && 
      currentTime <= act.endTime
    );

    return { 
      ...prof, 
      currentActivity: isToday ? activeActivity : undefined, // Só mostra ausência "agora" se for hoje
      allDailyActivities: dailyActivities 
    };
  });

  // Filtra quem está em atividade (AGORA se for hoje, ou NO DIA se for outra data)
  const absentProfessionalsList = professionalsWithActivity.filter(p => 
    isToday ? p.currentActivity : p.allDailyActivities!.length > 0
  );

  const currentlyAbsentCount = professionalsWithActivity.filter(p => p.currentActivity).length;

  // Para o contador de ausências totais do dia (se houver atividade planejada em qualquer horário)
  const allDailyAbsencesCount = professionalsWithActivity.filter(p => 
    p.allDailyActivities!.length > 0
  ).length;

  return (
    <div className="p-4 md:p-8 space-y-8 md:space-y-12 flex-1 animate-in fade-in duration-500 overflow-x-hidden">
      <div className="grid grid-cols-12 gap-8 md:gap-10">
        {/* Left Column: Title + Timeline */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-8 md:space-y-12">
          {/* Hero Heading Section */}
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-3 text-primary-light font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">
              <div className={`w-1.5 h-1.5 rounded-full bg-primary-light ${isToday ? 'animate-pulse' : ''}`} />
              {isToday ? 'Visão Geral em Tempo Real' : 'Consulta Histórica/Planejamento'}
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-on-surface leading-[1.1]">
              Resumo do <span className="text-primary">Dia</span>
            </h2>
            <div className="text-on-surface-variant font-medium text-base md:text-lg leading-relaxed flex flex-wrap items-center gap-x-1.5">
              <span>{weekday},</span>
              <PremiumDatePicker 
                value={selectedDate}
                onChange={setSelectedDate}
                variant="inline"
                customDisplay={dayAndMonth}
                align="left"
              />
              <span>•</span>
              <span className="text-primary font-bold">{dailyActivities.length} atividades</span> 
              <span>planejadas</span>
            </div>
          </div>

          <Timeline 
            onActivityClick={handleOpenDetail} 
            activities={dailyActivities}
            professionals={PROFESSIONALS_MOCK}
          />
        </div>

        {/* Right Column: Cards + RightSidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6 md:space-y-8">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Ausências Card */}
            <div className="bg-brand-dark p-5 md:p-7 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col items-center justify-center min-w-0 group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-error/10 rounded-full blur-2xl group-hover:bg-error/20 transition-all duration-700"></div>
              
              <div className="flex items-center gap-4 mb-3 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/[0.03] rounded-[15px] flex items-center justify-center border border-white/10 group-hover:border-error/50 transition-all duration-500 shadow-inner">
                  <UserX size={20} strokeWidth={2.5} className="text-white group-hover:text-error transition-colors" />
                </div>
                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-xl">
                  {String(allDailyAbsencesCount).padStart(2, '0')}
                </span>
              </div>
              
              <span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.25em] text-center relative z-10 group-hover:text-white transition-colors">
                Ausências
              </span>
            </div>
            
            {/* Ausentes Agora Card */}
            <div className={`bg-brand-dark p-5 md:p-7 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col items-center justify-center min-w-0 group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden ${!isToday ? 'opacity-50 grayscale' : ''}`}>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-warning/10 rounded-full blur-2xl group-hover:bg-warning/20 transition-all duration-700"></div>
              
              <div className="flex items-center gap-4 mb-3 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/[0.03] rounded-[15px] flex items-center justify-center border border-white/10 group-hover:border-warning/50 transition-all duration-500 shadow-inner">
                  <Clock size={20} strokeWidth={2.5} className="text-white group-hover:text-warning transition-colors" />
                </div>
                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-xl">
                  {String(currentlyAbsentCount).padStart(2, '0')}
                </span>
              </div>
              
              <span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.25em] text-center relative z-10 group-hover:text-white transition-colors">
                Ausentes Agora
              </span>
            </div>
          </div>

          <RightSidebar 
            absentProfessionals={absentProfessionalsList} 
            onActivityClick={handleOpenDetail}
            onProfessionalClick={handleOpenProfDetail}
            className="flex-1"
            selectedDate={selectedDate}
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
