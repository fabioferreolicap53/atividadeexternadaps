import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Professionals } from './pages/Professionals';
import { Activities } from './pages/Activities';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import pb from './lib/pocketbase';

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
  careLines: string[];
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('daps_auth') === 'true';
  });
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'professionals' | 'activities' | 'settings'>(() => {
    return (localStorage.getItem('daps_current_page') as any) || 'dashboard';
  });
  const [activitiesFormOpen, setActivitiesFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Persistir estado de autenticação e página atual
  useEffect(() => {
    localStorage.setItem('daps_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('daps_current_page', currentPage);
  }, [currentPage]);

  // Estados globais
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [careLines, setCareLines] = useState<CareLine[]>([]);

  // Carregar dados do PocketBase
  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        
        // Busca paralela das coleções usando os nomes da imagem
        const [careLinesData, professionalsData, activitiesData] = await Promise.all([
          pb.collection('atividadeexternadaps53_linhasdecuidado').getFullList({ requestKey: null }),
          pb.collection('atividadeexternadaps53_profissionais').getFullList({ requestKey: null }),
          pb.collection('atividadeexternadaps53_atividades').getFullList({ requestKey: null })
        ]);

        // Mapear Linhas de Cuidado
        setCareLines(careLinesData.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          color: item.color
        })));

        // Mapear Profissionais
        setProfessionals(professionalsData.map(item => ({
          id: item.id,
          name: item.name,
          role: item.role,
          careLines: item.field || [] // O PocketBase retorna o campo 'field' (Relation) como array
        })));

        // Mapear Atividades
        setActivities(activitiesData.map(item => ({
          id: item.id,
          date: item.date.split(' ')[0], // Extrai apenas a data do formato ISO/UTC
          startTime: item.start_time,
          endTime: item.end_time,
          location: item.location,
          description: item.description,
          professionalIds: item.professionals // Campo Relation (array de IDs)
        })));

      } catch (error) {
        console.error("Erro ao sincronizar com PocketBase:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 font-headline font-bold text-sm animate-pulse uppercase tracking-widest">
            Sincronizando DAPS...
          </p>
        </div>
      </div>
    );
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
            careLines={careLines}
          />
        ) : currentPage === 'professionals' ? (
          <div className="flex-1 overflow-x-hidden">
            <Professionals 
              professionals={professionals} 
              setProfessionals={setProfessionals} 
              careLines={careLines} 
            />
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
              careLines={careLines}
            />
          </div>
        )}
      </main>
    </div>
  );
}
