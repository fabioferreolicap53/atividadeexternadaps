import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Professionals } from './pages/Professionals';
import { Activities } from './pages/Activities';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

export interface CareLine {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Activity {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  professionalIds: string[];
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  careLine?: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'professionals' | 'activities' | 'settings'>('dashboard');
  const [activitiesFormOpen, setActivitiesFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estado global compartilhado para Profissionais
  const [professionals, setProfessionals] = useState<Professional[]>([
    { id: '1', name: 'Dr. Ricardo Mendes', role: 'Diretor de Operações', careLine: 'Hiperdia / Saúde do Idoso' },
    { id: '2', name: 'Enf. Ana Souza', role: 'Coordenadora de Campo', careLine: 'Saúde da Mulher' },
    { id: '3', name: 'Beatriz Silveira', role: 'Arquiteta Sênior', careLine: 'Infraestrutura' },
    { id: '4', name: 'Marcos Vinícius', role: 'Engenheiro Civil', careLine: 'Saúde Mental' },
  ]);

  // Estado global compartilhado para Atividades
  const [activities, setActivities] = useState<Activity[]>([
    { 
      id: '1', 
      date: '2026-05-24', 
      startTime: '08:00', 
      endTime: '10:00', 
      location: 'Sala 402', 
      description: 'Reunião de Alinhamento Estratégico',
      professionalIds: ['1', '2', '3', '4']
    },
    { 
      id: '2', 
      date: '2026-05-24', 
      startTime: '10:30', 
      endTime: '12:30', 
      location: 'Zona Sul', 
      description: 'Vistoria de Campo: Projeto Áquila',
      professionalIds: ['3', '1']
    },
    { 
      id: '3', 
      date: '2026-05-24', 
      startTime: '14:00', 
      endTime: '16:00', 
      location: 'Auditório Central', 
      description: 'Capacitação em Novos Protocolos',
      professionalIds: ['2']
    },
  ]);

  // Estado global compartilhado para Linhas de Cuidado
  const [careLines, setCareLines] = useState<CareLine[]>([
    { id: 'Saúde da Mulher', name: 'Saúde da Mulher', description: 'Atendimento especializado feminino', color: '#ec4899' },
    { id: 'Saúde do Homem', name: 'Saúde do Homem', description: 'Atendimento especializado masculino', color: '#3b82f6' },
    { id: 'Saúde Mental', name: 'Saúde Mental', description: 'Acompanhamento psicológico e psiquiátrico', color: '#8b5cf6' },
    { id: 'Saúde da Família', name: 'Saúde da Família', description: 'Atendimento básico preventivo', color: '#10b981' },
    { id: 'Urgência e Emergência', name: 'Urgência e Emergência', description: 'Atendimento de alta complexidade', color: '#ef4444' },
  ]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const handlePageChange = (page: 'dashboard' | 'professionals' | 'activities' | 'settings') => {
    setCurrentPage(page);
    setActivitiesFormOpen(false); // Reset by default
  };

  const handleOpenActivitiesWithForm = () => {
    setCurrentPage('activities');
    setActivitiesFormOpen(true);
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        onOpenActivitiesForm={handleOpenActivitiesWithForm}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsAuthenticated(false)}
      />
      
      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <TopNav onOpenMenu={() => setIsSidebarOpen(true)} currentPage={currentPage} />
        
        {currentPage === 'dashboard' ? (
          <Dashboard 
            activities={activities} 
            professionals={professionals} 
          />
        ) : currentPage === 'professionals' ? (
          <div className="flex-1 overflow-x-hidden">
            <Professionals careLines={careLines} />
          </div>
        ) : currentPage === 'settings' ? (
          <div className="flex-1 overflow-x-hidden">
            <Settings careLines={careLines} setCareLines={setCareLines} />
          </div>
        ) : (
          <div className="flex-1 overflow-x-hidden">
            <Activities 
              key={activitiesFormOpen ? 'open' : 'closed'} 
              initialFormOpen={activitiesFormOpen}
              activities={activities}
              setActivities={setActivities}
              professionals={professionals}
            />
          </div>
        )}
      </main>
    </div>
  );
}
