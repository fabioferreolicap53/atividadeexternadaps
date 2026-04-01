import { 
  Users, 
  CalendarCheck, 
  LayoutDashboard, 
  Plus, 
  LogOut,
  X,
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentPage: 'dashboard' | 'professionals' | 'activities' | 'settings';
  onPageChange: (page: 'dashboard' | 'professionals' | 'activities' | 'settings') => void;
  onOpenActivitiesForm: () => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onPageChange, onOpenActivitiesForm, isOpen, onClose, onLogout }: SidebarProps) {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`h-screen w-64 fixed left-0 top-0 bg-brand-dark flex flex-col p-4 space-y-6 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-2 py-4 lg:py-6">
          <div className="flex flex-col gap-1 group cursor-default">
            <div className="flex items-center gap-3">
              {/* Logo Icon Container - Premium Style */}
              <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
                {/* Outer Glow / Halo */}
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Inner Container with Double Border effect */}
                <div className="relative w-full h-full bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md overflow-hidden">
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  
                  <CalendarCheck className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" size={28} strokeWidth={2.5} />
                </div>
              </div>

              {/* Text Logo */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-black text-white font-headline tracking-[-0.03em] leading-tight">
                  Atividades<span className="text-white/40 group-hover:text-white transition-colors duration-500">.</span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="h-[2px] w-5 bg-gradient-to-r from-white/40 to-transparent rounded-full"></span>
                  <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.25em] leading-none group-hover:text-white/90 transition-colors duration-500">
                    Externas DAPS
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => { onPageChange('dashboard'); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all font-headline text-sm rounded-lg ${
              currentPage === 'dashboard' 
                ? 'bg-white/10 text-white shadow-sm font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Resumo do Dia</span>
          </button>

          <button 
            onClick={() => { onPageChange('activities'); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all font-headline text-sm rounded-lg ${
              currentPage === 'activities' 
                ? 'bg-white/10 text-white shadow-sm font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <CalendarCheck size={20} />
            <span>Atividades</span>
          </button>

          <button 
            onClick={() => { onPageChange('professionals'); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all font-headline text-sm rounded-lg ${
              currentPage === 'professionals' 
                ? 'bg-white/10 text-white shadow-sm font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Users size={20} />
            <span>Profissionais</span>
          </button>

          <button 
            onClick={() => { onPageChange('settings'); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all font-headline text-sm rounded-lg ${
              currentPage === 'settings' 
                ? 'bg-white/10 text-white shadow-sm font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </button>
        </nav>

        <div className="pt-4 border-t border-white/10">
          <button 
            onClick={() => { onOpenActivitiesForm(); onClose(); }}
            className="w-full bg-white text-brand-dark py-3.5 rounded-xl font-headline font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-[0.97] duration-300 shadow-xl shadow-black/20 hover:shadow-white/5 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            Agendar Atividade
          </button>
        </div>

        <div className="mt-auto space-y-1 pb-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all font-headline text-sm font-medium rounded-lg"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
