import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  UserPlus,
  Stethoscope,
  HeartPulse,
  Loader2
} from 'lucide-react';
import { PremiumMultiSelect } from '../components/PremiumSelect';
import { PremiumConfirmModal } from '../components/PremiumConfirmModal';
import { PremiumPasswordModal } from '../components/PremiumPasswordModal';
import { CareLine, Professional } from '../App';
import pb from '../lib/pocketbase';

interface ProfessionalsProps {
  professionals: Professional[];
  setProfessionals: React.Dispatch<React.SetStateAction<Professional[]>>;
  careLines: CareLine[];
}

export function Professionals({ professionals, setProfessionals, careLines }: ProfessionalsProps) {
  // Converter as linhas de cuidado dinâmicas para o formato esperado pelo Select
  // Usamos o ID da linha de cuidado para salvar no Relation do PocketBase
  const careLineOptions = useMemo(() => 
    careLines.map(line => ({ id: line.id, name: line.name })), 
    [careLines]
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete confirmation states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profToDelete, setProfToDelete] = useState<Professional | null>(null);
  
  // Password validation states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'edit' | 'delete'; data?: any } | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [selectedCareLines, setSelectedCareLines] = useState<string[]>([]);

  const handleOpenForm = (professional?: Professional) => {
    if (professional) {
      setPendingAction({ type: 'edit', data: professional });
      setIsPasswordModalOpen(true);
      return;
    }
    
    setEditingId(null);
    setName('');
    setSelectedCareLines([]);
    setIsFormOpen(true);
  };

  const handlePasswordConfirmed = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'edit') {
      const professional = pendingAction.data as Professional;
      setEditingId(professional.id);
      setName(professional.name);
      setSelectedCareLines(professional.careLines || []);
      setIsFormOpen(true);
    } else if (pendingAction.type === 'delete') {
      setProfToDelete(pendingAction.data);
      setIsDeleteModalOpen(true);
    }
    
    setPendingAction(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setName('');
    setSelectedCareLines([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const data = {
        name: name.trim(),
        role: 'Profissional DAPS', // Valor padrão para campo obrigatório no banco
        field: selectedCareLines // Usando 'field' conforme visto na sua imagem anterior da coleção
      };

      if (editingId) {
        const updatedRecord = await pb.collection('atividadeexternadaps53_profissionais').update(editingId, data);
        setProfessionals(prev => prev.map(p => 
          p.id === editingId ? { ...p, name: updatedRecord.name, careLines: updatedRecord.field || [] } : p
        ));
      } else {
        const newRecord = await pb.collection('atividadeexternadaps53_profissionais').create(data);
        const newProf: Professional = {
          id: newRecord.id,
          name: newRecord.name,
          role: newRecord.role,
          careLines: newRecord.field || []
        };
        setProfessionals(prev => [...prev, newProf]);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      alert("Erro ao salvar profissional no PocketBase. Verifique se as API Rules estão abertas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (prof: Professional) => {
    setPendingAction({ type: 'delete', data: prof });
    setIsPasswordModalOpen(true);
  };

  const confirmDelete = async () => {
    if (profToDelete) {
      try {
        await pb.collection('atividadeexternadaps53_profissionais').delete(profToDelete.id);
        setProfessionals(prev => prev.filter(p => p.id !== profToDelete.id));
        setProfToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir profissional:", error);
        alert("Erro ao excluir profissional.");
      }
    }
  };

  const filteredProfessionals = professionals.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
            Profissionais
          </h2>
          <p className="text-on-surface-variant font-medium text-base md:text-lg">
            Gerencie a equipe e suas respectivas linhas de cuidado
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenForm()}
          className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark/90 transition-all active:scale-95 shadow-md shadow-black/20 w-full md:w-auto"
        >
          <UserPlus size={20} />
          Novo Profissional
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00488d] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou linha de cuidado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-[2.5px] border-slate-200 focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/5 rounded-2xl h-[56px] pl-12 pr-4 text-on-surface placeholder:text-slate-400 outline-none transition-all shadow-sm font-bold text-sm"
          />
        </div>
      </div>

      {/* Grid of Professionals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProfessionals.map(prof => (
          <div key={prof.id} className="bg-surface-container-lowest p-5 md:p-8 rounded-[32px] shadow-sm border border-outline-variant/10 hover:shadow-xl hover:shadow-black/5 transition-all group relative overflow-hidden flex flex-col">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="bg-primary/5 p-3 md:p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                <Users size={24} className="md:w-7 md:h-7" />
              </div>
              <div className="flex gap-1.5 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border border-white/40 shadow-sm transition-all duration-300 relative z-20">
                <button 
                  onClick={() => handleOpenForm(prof)}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(prof)}
                  className="p-2 text-slate-400 hover:text-error hover:bg-error/5 rounded-lg transition-all"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="relative z-10 flex-1">
              <h3 className="text-xl md:text-2xl font-black text-on-surface mb-4 tracking-tight group-hover:text-primary transition-colors">{prof.name}</h3>
              
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 opacity-50">Linhas de Atuação</p>
              
              <div className="flex flex-wrap gap-2">
                {prof.careLines && prof.careLines.length > 0 ? (
                  prof.careLines.map(lineId => {
                    const line = careLines.find(l => l.id === lineId);
                    return line ? (
                      <span 
                        key={line.id} 
                        className="bg-brand-dark/5 text-brand-dark px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-brand-dark/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all"
                        style={{ color: line.color, borderColor: `${line.color}20`, backgroundColor: `${line.color}10` }}
                      >
                        {line.name}
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-slate-400 text-[10px] md:text-xs italic font-medium">Nenhuma linha definida</span>
                )}
              </div>
            </div>

            {/* Bottom info/action for mobile */}
            <div className="mt-6 pt-6 border-t border-outline-variant/5 flex items-center justify-between relative z-10 md:hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ações Rápidas</span>
              <div className="flex gap-2">
                <button onClick={() => handleOpenForm(prof)} className="text-primary font-bold text-xs px-3 py-1 bg-primary/5 rounded-lg">Editar</button>
                <button onClick={() => handleDelete(prof)} className="text-error font-bold text-xs px-3 py-1 bg-error/5 rounded-lg">Excluir</button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProfessionals.length === 0 && (
          <div className="col-span-full py-20 text-center bg-surface-container-low/30 rounded-3xl border-2 border-dashed border-outline-variant/30">
            <div className="bg-surface-container-low w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <p className="text-on-surface-variant font-medium">Nenhum profissional encontrado</p>
          </div>
        )}
      </div>

      <PremiumConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remover Profissional?"
        description="Você está prestes a remover este profissional e todas as suas atribuições do sistema."
        itemName={profToDelete?.name}
      />

      <PremiumPasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onConfirm={handlePasswordConfirmed}
        title={pendingAction?.type === 'edit' ? 'Autorizar Edição' : 'Autorizar Exclusão'}
        description={pendingAction?.type === 'edit' 
          ? 'Para editar os dados deste profissional, insira sua senha de acesso para confirmar sua identidade.' 
          : 'Para remover este profissional do sistema, é necessária a validação da sua senha de login.'
        }
        actionLabel={pendingAction?.type === 'edit' ? 'Liberar Edição' : 'Liberar Exclusão'}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-brand-dark w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10 relative">
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 text-white p-2 rounded-lg">
                  <Stethoscope size={20} />
                </div>
                <h3 className="text-xl font-black font-headline text-white uppercase tracking-tight">
                  {editingId ? 'Editar Profissional' : 'Novo Profissional'}
                </h3>
              </div>
              <button onClick={handleCloseForm} className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em] ml-1">Nome Completo</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Dra. Maria Silva"
                  className="w-full bg-white border-[2.5px] border-slate-200 focus:border-white focus:ring-4 focus:ring-white/10 rounded-2xl py-4 px-4 text-brand-dark placeholder:text-slate-400 outline-none transition-all font-bold text-sm"
                />
              </div>

              <PremiumMultiSelect 
                label="Linhas de Cuidado"
                selectedValues={selectedCareLines}
                onChange={setSelectedCareLines}
                options={careLineOptions}
                icon={HeartPulse}
                placeholder="Selecione as linhas de cuidado..."
              />

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-white/60 bg-white/10 hover:bg-white/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-brand-dark bg-white hover:bg-white/90 shadow-lg shadow-black/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {isSubmitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Cadastrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
