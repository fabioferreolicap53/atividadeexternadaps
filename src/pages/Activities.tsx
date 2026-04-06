import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  CalendarPlus,
  Search,
  Users,
  ArrowRight
} from 'lucide-react';
import { PremiumSelect, PremiumDatePicker, PremiumTimePicker, PremiumMultiSelect } from '../components/PremiumSelect';
import { PremiumConfirmModal } from '../components/PremiumConfirmModal';

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
  careLine: string;
}

interface ActivitiesProps {
  initialFormOpen?: boolean;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  professionals: Professional[];
  key?: string;
}

export function Activities({ 
  initialFormOpen = false,
  activities,
  setActivities,
  professionals: PROFESSIONALS_MOCK
}: ActivitiesProps) {
  const [isFormOpen, setIsFormOpen] = useState(initialFormOpen);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete confirmation states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfessionalId, setFilterProfessionalId] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [professionalIds, setProfessionalIds] = useState<string[]>([]);

  // Função para adicionar 2 horas a um horário HH:mm
  const addTwoHours = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    let newHours = hours + 2;
    if (newHours >= 24) newHours = 23; // Limita ao final do dia se necessário
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Função para comparar horários HH:mm
  const isTimeBefore = (time1: string, time2: string) => {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return h1 < h2 || (h1 === h2 && m1 < m2);
  };

  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime);
    // Sempre mantém a diferença de 2 horas por padrão
    const suggestedEndTime = addTwoHours(newTime);
    setEndTime(suggestedEndTime);
  };

  const handleEndTimeChange = (newTime: string) => {
    // Regra: Não permite que o fim seja antes do início
    if (isTimeBefore(newTime, startTime)) {
      alert("O horário de término não pode ser anterior ao horário de início.");
      return;
    }
    setEndTime(newTime);
  };

  const handleOpenForm = (activity?: Activity) => {
    if (activity) {
      setEditingId(activity.id);
      setDate(activity.date);
      setStartTime(activity.startTime);
      setEndTime(activity.endTime);
      setLocation(activity.location);
      setDescription(activity.description);
      setProfessionalIds(activity.professionalIds);
    } else {
      setEditingId(null);
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('08:00');
      setEndTime('10:00');
      setLocation('');
      setDescription('');
      setProfessionalIds([]);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !location || !description || professionalIds.length === 0) return;

    if (editingId) {
      setActivities((prev: Activity[]) => prev.map((a: Activity) => 
        a.id === editingId ? { ...a, date, startTime, endTime, location, description, professionalIds } : a
      ));
    } else {
      const newActivity: Activity = {
        id: Math.random().toString(36).substring(2, 11),
        date,
        startTime,
        endTime,
        location,
        description,
        professionalIds
      };
      setActivities((prev: Activity[]) => [...prev, newActivity]);
    }
    handleCloseForm();
  };

  const handleDelete = (activity: Activity) => {
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (activityToDelete) {
      setActivities((prev: Activity[]) => prev.filter((a: Activity) => a.id !== activityToDelete.id));
      setActivityToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterProfessionalId('all');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((a: Activity) => {
      // Search term
      const matchesSearch = 
        a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.professionalIds.some((pid: string) => 
          PROFESSIONALS_MOCK.find(p => p.id === pid)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Professional filter
      const matchesProfessional = filterProfessionalId === 'all' || a.professionalIds.includes(filterProfessionalId);

      // Date range filter
      const activityDate = new Date(a.date);
      const matchesStartDate = !filterStartDate || activityDate >= new Date(filterStartDate);
      const matchesEndDate = !filterEndDate || activityDate <= new Date(filterEndDate);

      return matchesSearch && matchesProfessional && matchesStartDate && matchesEndDate;
    });
  }, [activities, searchTerm, filterProfessionalId, filterStartDate, filterEndDate]);

  const locationOptions = [
    { id: 'CF ALICE DE JESUS REGO', name: 'CF ALICE DE JESUS REGO' },
    { id: 'CF DEOLINDO COUTO', name: 'CF DEOLINDO COUTO' },
    { id: 'CF EDSON ABDALLA SAAD', name: 'CF EDSON ABDALLA SAAD' },
    { id: 'CF ERNANI DE PAIVA FERREIRA BRAGA', name: 'CF ERNANI DE PAIVA FERREIRA BRAGA' },
    { id: 'CF HELANDE DE MELLO GONÇALVES', name: 'CF HELANDE DE MELLO GONÇALVES' },
    { id: 'CF ILZO MOTTA DE MELLO', name: 'CF ILZO MOTTA DE MELLO' },
    { id: 'CF JAMIL HADDAD', name: 'CF JAMIL HADDAD' },
    { id: 'CF JOÃO BATISTA CHAGAS', name: 'CF JOÃO BATISTA CHAGAS' },
    { id: 'CF JOSÉ ANTÔNIO CIRAUDO', name: 'CF JOSÉ ANTÔNIO CIRAUDO' },
    { id: 'CF LENICE MARIA MONTEIRO COELHO', name: 'CF LENICE MARIA MONTEIRO COELHO' },
    { id: 'CF LOURENÇO DE MELLO', name: 'CF LOURENÇO DE MELLO' },
    { id: 'CF SAMUEL PENHA VALLE', name: 'CF SAMUEL PENHA VALLE' },
    { id: 'CF SÉRGIO AROUCA', name: 'CF SÉRGIO AROUCA' },
    { id: 'CF VALÉRIA GOMES ESTEVES', name: 'CF VALÉRIA GOMES ESTEVES' },
    { id: 'CF WALDEMAR BERARDINELLI', name: 'CF WALDEMAR BERARDINELLI' },
    { id: 'CMS ADELINO SIMÕES', name: 'CMS ADELINO SIMÕES' },
    { id: 'CMS ALOYSIO AMÂNCIO DA SILVA', name: 'CMS ALOYSIO AMÂNCIO DA SILVA' },
    { id: 'CMS CATTAPRETA', name: 'CMS CATTAPRETA' },
    { id: 'CMS CESÁRIO DE MELO', name: 'CMS CESÁRIO DE MELO' },
    { id: 'CMS CYRO DE MELLO', name: 'CMS CYRO DE MELLO' },
    { id: 'CMS DÉCIO AMARAL FILHO', name: 'CMS DÉCIO AMARAL FILHO' },
    { id: 'CMS EMYDIO CABRAL', name: 'CMS EMYDIO CABRAL' },
    { id: 'CMS FLORIPES GALDINO PEREIRA', name: 'CMS FLORIPES GALDINO PEREIRA' },
    { id: 'CMS MARIA APARECIDA DE ALMEIDA', name: 'CMS MARIA APARECIDA DE ALMEIDA' },
    { id: 'CMS SÁVIO ANTUNES', name: 'CMS SÁVIO ANTUNES' },
    { id: 'SMS POLICLÍNICA LINCOLN DE FREITAS FILHO', name: 'SMS POLICLÍNICA LINCOLN DE FREITAS FILHO' },
    { id: 'CAPS SIMÃO BACAMARTE', name: 'CAPS SIMÃO BACAMARTE' },
    { id: 'CAPSAD II JÚLIO CÉSAR DE CARVALHO', name: 'CAPSAD II JÚLIO CÉSAR DE CARVALHO' },
    { id: 'CAPSI SANTA CRUZ', name: 'CAPSI SANTA CRUZ' },
    { id: 'HOSPITAL MUNICIPAL PEDRO SEGUNDO', name: 'HOSPITAL MUNICIPAL PEDRO SEGUNDO' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
            Atividades
          </h2>
          <p className="text-on-surface-variant font-medium text-base md:text-lg">
            Planeje e gerencie as atividades externas da equipe
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenForm()}
          className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark/90 transition-all active:scale-95 shadow-md shadow-black/20 w-full md:w-auto"
        >
          <CalendarPlus size={20} />
          Novo Agendamento
        </button>
      </header>

      {/* Toolbar and Filters */}
      <div className="bg-surface-container-low p-4 md:p-6 rounded-[32px] space-y-6 shadow-sm border border-outline-variant/5">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-dark transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por descrição, local ou profissional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-[2.5px] border-slate-200 focus:border-brand-dark focus:ring-4 focus:ring-brand-dark/5 rounded-2xl h-[56px] pl-12 pr-4 text-on-surface placeholder:text-slate-400 outline-none transition-all shadow-sm font-bold text-sm"
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="w-full md:w-[260px]">
              <PremiumSelect 
                label="" 
                value={filterProfessionalId}
                onChange={setFilterProfessionalId}
                options={[
                  { id: 'all', name: 'Todos os Profissionais' },
                  ...PROFESSIONALS_MOCK
                ]}
                icon={Users}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] items-center gap-3">
              <div className="w-full sm:w-[160px]">
                <PremiumDatePicker 
                  value={filterStartDate}
                  onChange={setFilterStartDate}
                  placeholder="Início"
                  icon={Calendar}
                  align="right"
                />
              </div>
              
              <div className="hidden sm:flex items-center justify-center">
                <ArrowRight size={16} className="text-slate-300 shrink-0" />
              </div>
              
              <div className="w-full sm:w-[160px]">
                <PremiumDatePicker 
                  value={filterEndDate}
                  onChange={setFilterEndDate}
                  placeholder="Fim"
                  icon={Calendar}
                  align="right"
                />
              </div>
            </div>

            {(searchTerm || filterProfessionalId !== 'all' || filterStartDate || filterEndDate) && (
              <button 
                onClick={clearFilters}
                className="text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 px-6 py-3 rounded-xl transition-all shrink-0 bg-primary/5 border border-primary/10"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List of Activities */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {filteredActivities.map(activity => {
          const professionals = activity.professionalIds.map(pid => PROFESSIONALS_MOCK.find(p => p.id === pid)).filter(Boolean) as Professional[];
          return (
            <div key={activity.id} className="bg-surface-container-lowest p-3 md:p-4 rounded-3xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:shadow-black/5 transition-all group flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 md:gap-6 relative overflow-hidden">
              {/* Status accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/10 group-hover:bg-primary transition-all duration-500" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-y-4 gap-x-4 md:gap-x-8 flex-1 ml-3 py-1">
                {/* Data Section */}
                <div className="flex items-center gap-3 group/item">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500 shadow-inner">
                    <Calendar size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em] opacity-40 leading-none mb-1">Data</p>
                    <p className="text-sm font-black text-on-surface whitespace-nowrap tracking-tight leading-none">
                      {activity.date.split('-').reverse().join('/')}
                    </p>
                  </div>
                </div>

                {/* Horário Section */}
                <div className="flex items-center gap-3 group/item">
                  <div className="w-10 h-10 bg-secondary/5 rounded-xl flex items-center justify-center text-secondary shrink-0 group-hover/item:scale-110 group-hover/item:bg-secondary group-hover/item:text-white transition-all duration-500 shadow-inner">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em] opacity-40 leading-none mb-1">Horário</p>
                    <p className="text-sm font-black text-on-surface whitespace-nowrap tracking-tight leading-none">{activity.startTime} - {activity.endTime}</p>
                  </div>
                </div>

                {/* Profissional Section */}
                <div className="flex items-center gap-3 group/item">
                  <div className="w-10 h-10 bg-tertiary/5 rounded-xl flex items-center justify-center text-tertiary shrink-0 group-hover/item:scale-110 group-hover/item:bg-tertiary group-hover/item:text-white transition-all duration-500 shadow-inner">
                    <Users size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em] opacity-40 leading-none mb-1">
                      {professionals.length > 1 ? 'Profissionais' : 'Profissional'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {professionals.map((p, idx) => (
                        <span key={p.id} className="text-sm font-black text-on-surface tracking-tight leading-none">
                          {p.name}{idx < professionals.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                    {professionals.length === 1 && professionals[0].careLine && (
                      <p className="text-[8px] font-bold text-primary/60 italic uppercase tracking-tighter leading-none truncate mt-1">{professionals[0].careLine}</p>
                    )}
                  </div>
                </div>

                {/* Local Section */}
                <div className="flex items-center gap-3 group/item">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 group-hover/item:scale-110 group-hover/item:bg-slate-500 group-hover/item:text-white transition-all duration-500 shadow-inner">
                    <MapPin size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em] opacity-40 leading-none mb-1">Local</p>
                    <p className="text-sm font-black text-on-surface truncate tracking-tight leading-none">{activity.location}</p>
                  </div>
                </div>

                {/* Descrição Section - Expands on larger screens */}
                <div className="flex items-start gap-3 group/item sm:col-span-2 lg:col-span-2 2xl:col-span-1">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 group-hover/item:scale-110 group-hover/item:bg-slate-400 group-hover/item:text-white transition-all duration-500 shadow-inner">
                    <FileText size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em] opacity-40 leading-none mb-1">Descrição</p>
                    <p className="text-xs font-bold text-on-surface leading-tight break-words 2xl:line-clamp-1">{activity.description}</p>
                  </div>
                </div>
              </div>

              {/* Actions Section - Optimized for Grid */}
              <div className="flex 2xl:flex-col gap-1.5 shrink-0 md:pl-6 border-t 2xl:border-t-0 2xl:border-l border-outline-variant/10 pt-3 2xl:pt-0">
                <button 
                  onClick={() => handleOpenForm(activity)}
                  className="flex-1 2xl:flex-none w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 border border-transparent hover:border-primary/10"
                  title="Editar"
                >
                  <Edit2 size={18} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => handleDelete(activity)}
                  className="flex-1 2xl:flex-none w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/5 rounded-xl transition-all duration-300 border border-transparent hover:border-error/10"
                  title="Excluir"
                >
                  <Trash2 size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredActivities.length === 0 && (
          <div className="py-24 text-center bg-surface-container-low/30 rounded-[40px] border-2 border-dashed border-outline-variant/30">
            <div className="bg-surface-container-low w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Nenhuma atividade encontrada</h3>
            <p className="text-on-surface-variant font-medium">Tente ajustar seus filtros ou busca.</p>
          </div>
        )}
      </div>

      <PremiumConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Agendamento?"
        description="Você está prestes a remover este agendamento do sistema. Esta ação requer atenção especial."
        itemName={activityToDelete ? `${activityToDelete.description} (${activityToDelete.date.split('-').reverse().join('/')})` : ''}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-brand-dark w-full max-w-2xl rounded-t-[32px] md:rounded-[32px] shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 duration-300 max-h-[95vh] flex flex-col border border-white/10 relative">
            <div className="px-6 md:px-8 py-4 md:py-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0 rounded-t-[32px]">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 text-white p-2 md:p-2.5 rounded-xl shadow-lg">
                  <CalendarPlus size={18} className="md:w-5 md:h-5" />
                </div>
                <h3 className="text-base md:text-lg font-black font-headline text-white uppercase tracking-tight">
                  {editingId ? 'EDITAR AGENDAMENTO' : 'NOVO AGENDAMENTO'}
                </h3>
              </div>
              <button onClick={handleCloseForm} className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-5 md:space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 md:gap-y-6">
                <div className="md:col-span-3">
                  <PremiumMultiSelect 
                    label="Profissionais Responsáveis"
                    selectedValues={professionalIds}
                    onChange={setProfessionalIds}
                    options={PROFESSIONALS_MOCK}
                    icon={Users}
                    placeholder="Selecione os profissionais..."
                  />
                </div>

                <div className="md:col-span-1">
                  <PremiumDatePicker 
                    label="Data da Atividade"
                    value={date}
                    onChange={setDate}
                  />
                </div>

                <div className="md:col-span-1">
                  <PremiumTimePicker 
                    label="Horário de Início"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                </div>

                <div className="md:col-span-1">
                  <PremiumTimePicker 
                    label="Horário de Término"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>

                <div className="md:col-span-3">
                  <PremiumSelect 
                    label="Local da Atividade Externa"
                    value={location}
                    onChange={setLocation}
                    options={locationOptions}
                    icon={MapPin}
                    showSearch={true}
                    onCustomValue={setLocation}
                    customPlaceholder="Digitar local personalizado..."
                  />
                </div>

                <div className="md:col-span-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
                      <FileText size={12} className="text-primary-light" />
                      Descrição do Evento Externo
                    </label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva os detalhes da atividade..."
                      className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all min-h-[120px] resize-none text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0">
                <button 
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 py-3.5 md:py-4 px-6 rounded-2xl font-bold text-white/60 bg-white/10 hover:bg-white/20 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 md:py-4 px-6 rounded-2xl font-bold text-brand-dark bg-white hover:bg-white/90 shadow-xl shadow-black/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
