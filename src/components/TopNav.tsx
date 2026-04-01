import { Menu, LayoutDashboard, Users, CalendarCheck, Settings } from 'lucide-react';

interface TopNavProps {
  onOpenMenu: () => void;
  currentPage: 'dashboard' | 'professionals' | 'activities' | 'settings';
}

const PAGE_TITLES = {
  dashboard: { title: 'Resumo do Dia', icon: LayoutDashboard },
  activities: { title: 'Atividades', icon: CalendarCheck },
  professionals: { title: 'Profissionais', icon: Users },
  settings: { title: 'Configurações', icon: Settings },
};

export function TopNav({ onOpenMenu, currentPage }: TopNavProps) {
  const { title, icon: Icon } = PAGE_TITLES[currentPage];

  return (
    <header className="w-full sticky top-0 z-[40] bg-brand-dark/95 backdrop-blur-md border-b border-white/5 font-headline antialiased flex justify-between items-center px-4 md:px-8 py-4 ml-auto h-16 lg:h-20 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMenu}
          className="p-2.5 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 lg:hidden transition-all rounded-xl border border-white/10 active:scale-95"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-8 h-8 bg-gradient-to-tr from-white/20 to-white/5 rounded-lg flex items-center justify-center border border-white/10 shadow-inner">
            <Icon className="text-white" size={16} strokeWidth={2.5} />
          </div>
          <h2 className="text-base font-black text-white uppercase tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Sistema Online</span>
      </div>
    </header>
  );
}
