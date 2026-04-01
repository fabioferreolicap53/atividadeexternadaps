import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  HeartPulse,
  LayoutGrid
} from 'lucide-react';
import { CareLine } from '../App';
import { PremiumConfirmModal } from '../components/PremiumConfirmModal';

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

interface SettingsProps {
  careLines: CareLine[];
  setCareLines: React.Dispatch<React.SetStateAction<CareLine[]>>;
}

export function Settings({ careLines, setCareLines }: SettingsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', color: PRESET_COLORS[0] });

  // Delete confirmation states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lineToDelete, setLineToDelete] = useState<CareLine | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCareLines(careLines.map(line => 
        line.id === editingId ? { ...line, ...formData, description: '' } : line
      ));
      setEditingId(null);
    } else {
      const newLine: CareLine = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        description: ''
      };
      setCareLines([...careLines, newLine]);
    }
    setFormData({ name: '', color: PRESET_COLORS[0] });
    setIsFormOpen(false);
  };

  const handleEdit = (line: CareLine) => {
    setFormData({ name: line.name, color: line.color });
    setEditingId(line.id);
    setIsFormOpen(true);
  };

  const handleDelete = (line: CareLine) => {
    setLineToDelete(line);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (lineToDelete) {
      setCareLines(careLines.filter(line => line.id !== lineToDelete.id));
      setLineToDelete(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="space-y-3">
        <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
          <SettingsIcon size={14} strokeWidth={3} />
          Configurações
        </div>
        <h2 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-slate-900">
          Gestão de Parâmetros
        </h2>
      </header>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-100 text-slate-900 rounded-xl">
              <HeartPulse size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Linhas de Cuidado</h3>
              <p className="text-sm text-slate-500 font-medium">Categorias de especialidades do sistema</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', color: PRESET_COLORS[0] });
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
          >
            <Plus size={16} strokeWidth={3} />
            Nova Linha
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {careLines.map((line) => (
            <div 
              key={line.id}
              className="group relative bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundColor: line.color, boxShadow: `0 8px 20px -6px ${line.color}` }}
                >
                  <LayoutGrid size={24} strokeWidth={2.5} />
                </div>
                <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-sm relative z-20">
                  <button 
                    onClick={() => handleEdit(line)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all shadow-sm"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(line)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-black text-lg text-slate-900 mb-2 tracking-tight group-hover:text-slate-700 transition-colors">{line.name}</h4>
              </div>

              {/* Mobile quick actions */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between md:hidden">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Ações Rápidas</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(line)} className="text-slate-900 font-bold text-xs px-3 py-1 bg-slate-50 rounded-lg">Editar</button>
                  <button onClick={() => handleDelete(line)} className="text-red-500 font-bold text-xs px-3 py-1 bg-red-50 rounded-lg">Excluir</button>
                </div>
              </div>
            </div>
          ))}


          {careLines.length === 0 && (
            <div className="col-span-full text-center py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                <HeartPulse size={28} />
              </div>
              <p className="text-slate-900 font-bold">Nenhuma linha de cuidado</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Clique em "Nova Linha" para começar</p>
            </div>
          )}
        </div>
      </section>

      <PremiumConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Linha de Cuidado?"
        description="Esta ação removerá permanentemente a categoria e afetará a classificação dos profissionais vinculados."
        itemName={lineToDelete?.name}
      />

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 duration-300 border border-slate-100 relative">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 rounded-t-[32px]">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {editingId ? 'Editar Linha' : 'Nova Linha'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Nome da Linha</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Saúde Mental"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl px-5 py-3.5 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Cor de Identificação</label>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-9 h-9 rounded-xl transition-all duration-300 flex items-center justify-center ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {formData.color === color && <Save size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
                >
                  {editingId ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
