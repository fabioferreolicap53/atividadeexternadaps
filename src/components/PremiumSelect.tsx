import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Calendar, ChevronLeft, ChevronRight, Search, Pencil } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface PremiumSelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  icon: any;
  placeholder?: string;
  align?: 'left' | 'right';
  showSearch?: boolean;
  onCustomValue?: (val: string) => void;
  customPlaceholder?: string;
}

export function PremiumSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  icon: Icon,
  placeholder = "Selecione...",
  align = 'left',
  showSearch = false,
  onCustomValue,
  customPlaceholder = "Digitar local personalizado..."
}: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.id === value);
  
  // Se o valor não estiver nas opções e não estivermos em modo custom, 
  // pode ser um valor customizado vindo do banco
  const isValueCustom = value && !selectedOption;

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setIsCustomMode(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCustomMode && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [isCustomMode]);

  return (
    <div className={`relative ${label ? 'space-y-2' : ''} ${isOpen ? 'z-[110]' : 'z-10'}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-4 bg-white border-[2.5px] transition-all rounded-2xl py-3 px-4 text-left shadow-sm h-[56px] ${
          isOpen ? 'border-brand-dark ring-4 ring-brand-dark/5' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className={`p-2 rounded-xl transition-colors shrink-0 ${isOpen ? 'bg-brand-dark/10 text-brand-dark' : 'bg-slate-50 text-slate-400'}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        
        <span className={`flex-1 font-bold text-sm truncate ${value ? 'text-slate-900' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.name : (value || placeholder)}
        </span>

        <ChevronDown size={20} className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-[100] left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
          {showSearch && (
            <div className="p-3 border-b border-slate-50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="py-1 max-h-[60vh] md:max-h-72 overflow-y-auto custom-scrollbar">
            {onCustomValue && (
              <div className="px-3 py-2">
                {isCustomMode ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border-2 border-brand-dark/20 ring-4 ring-brand-dark/5">
                    <Pencil size={14} className="text-brand-dark shrink-0" />
                    <input
                      ref={customInputRef}
                      type="text"
                      placeholder="Digite o local..."
                      value={customInputValue}
                      onChange={(e) => setCustomInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (customInputValue.trim()) {
                            onChange(customInputValue.trim());
                            setIsOpen(false);
                            setIsCustomMode(false);
                            setCustomInputValue('');
                          }
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 min-w-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (customInputValue.trim()) {
                          onChange(customInputValue.trim());
                          setIsOpen(false);
                          setIsCustomMode(false);
                          setCustomInputValue('');
                        }
                      }}
                      className="bg-brand-dark text-white p-1.5 rounded-lg hover:bg-brand-dark/90 transition-colors shrink-0"
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCustomMode(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-black text-brand-dark hover:bg-brand-dark/5 rounded-xl transition-all group"
                  >
                    <div className="p-1.5 bg-brand-dark/10 rounded-lg group-hover:bg-brand-dark group-hover:text-white transition-all">
                      <Pencil size={14} strokeWidth={3} />
                    </div>
                    <span>{customPlaceholder}</span>
                  </button>
                )}
              </div>
            )}

            <div className="h-[1px] bg-slate-50 mx-4 my-1" />

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-6 py-3.5 text-sm font-bold transition-all hover:bg-slate-50 ${
                    value === opt.id ? 'text-brand-dark bg-brand-dark/5' : 'text-slate-600'
                  }`}
                >
                  <span className="truncate pr-4">{opt.name}</span>
                  {value === opt.id && <Check size={18} strokeWidth={3} className="text-brand-dark shrink-0" />}
                </button>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-xs font-bold text-slate-400">Nenhum local encontrado</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface PremiumTimePickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: any;
}

export function PremiumTimePicker({ 
  label, 
  value, 
  onChange, 
  icon: Icon = Clock
}: PremiumTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hours, minutes] = value.split(':');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setHour = (h: string) => {
    onChange(`${h}:${minutes}`);
  };

  const setMinute = (m: string) => {
    onChange(`${hours}:${m}`);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  return (
    <div className={`relative ${label ? 'space-y-2' : ''} ${isOpen ? 'z-[110]' : 'z-10'}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-4 bg-white border-[2.5px] transition-all rounded-2xl py-3 px-4 text-left shadow-sm h-[56px] ${
          isOpen ? 'border-brand-dark ring-4 ring-brand-dark/5' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className={`p-2 rounded-xl transition-colors shrink-0 ${isOpen ? 'bg-brand-dark/10 text-brand-dark' : 'bg-slate-50 text-slate-400'}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        
        <span className="flex-1 font-bold text-sm text-slate-900">
          {value}
        </span>

        <ChevronDown size={20} className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-2 bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 flex gap-2 h-64 overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mb-2 sticky top-0 bg-white py-1">Horas</p>
            {hourOptions.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHour(h)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-slate-50 ${
                  hours === h ? 'text-brand-dark bg-brand-dark/5' : 'text-slate-600'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="w-[1px] bg-slate-100 self-stretch my-2" />
          <div className="flex-1 overflow-y-auto custom-scrollbar pl-1">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mb-2 sticky top-0 bg-white py-1">Minutos</p>
            {minuteOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMinute(m)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-slate-50 ${
                  minutes === m ? 'text-brand-dark bg-brand-dark/5' : 'text-slate-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Clock } from 'lucide-react';

interface PremiumDatePickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: any;
  align?: 'left' | 'right';
}

export function PremiumDatePicker({ 
  label, 
  value, 
  onChange, 
  placeholder = "dd/mm/aaaa",
  icon: Icon = Calendar,
  align = 'left'
}: PremiumDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Formata a data de YYYY-MM-DD para DD/MM/AAAA para exibição
  const displayValue = value ? value.split('-').reverse().join('/') : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const days = [];
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1));
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(year, month, day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const [vY, vM, vD] = value.split('-').map(Number);
    return vY === year && vM === month + 1 && vD === day;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  return (
    <div className={`relative ${label ? 'space-y-2' : ''} ${isOpen ? 'z-[110]' : 'z-10'}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-center gap-3 bg-white border-[2.5px] transition-all rounded-2xl h-[56px] px-4 shadow-sm cursor-pointer group ${
          isOpen ? 'border-brand-dark ring-4 ring-brand-dark/5' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <Icon 
          size={18} 
          strokeWidth={2.5} 
          className={`transition-colors shrink-0 ${isOpen ? 'text-brand-dark' : 'text-slate-400 group-hover:text-brand-dark'}`} 
        />
        
        <span className={`text-sm font-bold whitespace-nowrap overflow-hidden truncate ${displayValue ? 'text-slate-900' : 'text-slate-400'}`}>
          {displayValue || placeholder}
        </span>

        <Calendar 
          size={16} 
          strokeWidth={2.5} 
          className={`transition-colors shrink-0 ${isOpen ? 'text-brand-dark' : 'text-slate-300 group-hover:text-slate-400'}`} 
        />
      </div>

      {isOpen && (
        <div className={`absolute z-[100] mt-2 bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] border border-slate-100 p-4 md:p-5 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[300px] md:min-w-[320px] ${align === 'right' ? 'right-0 md:right-0' : 'left-0 md:left-0'} max-sm:fixed max-sm:inset-x-4 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:mt-0`}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <span className="font-black text-sm uppercase tracking-widest text-slate-900">
              {MONTHS[month]} {year}
            </span>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_SHORT.map(d => (
              <span key={d} className="text-[10px] font-black text-slate-400 uppercase text-center py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center">
                {day !== null ? (
                  <button
                    onClick={() => handleSelectDay(day)}
                    className={`w-full h-full rounded-xl text-xs font-bold transition-all ${
                      isSelected(day)
                        ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/20 scale-110'
                        : isToday(day)
                        ? 'bg-brand-dark/10 text-brand-dark hover:bg-brand-dark/20'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
            <button onClick={handleClear} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
              Limpar
            </button>
            <button onClick={handleToday} className="text-[10px] font-black uppercase tracking-widest text-brand-dark hover:bg-brand-dark/5 rounded-lg px-4 py-2 transition-all">
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface PremiumMultiSelectProps {
  label?: string;
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  options: Option[];
  icon: any;
  placeholder?: string;
  align?: 'left' | 'right';
}

export function PremiumMultiSelect({ 
  label, 
  selectedValues, 
  onChange, 
  options, 
  icon: Icon,
  placeholder = "Selecione opções...",
  align = 'left'
}: PremiumMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    const newValues = selectedValues.includes(id)
      ? selectedValues.filter(v => v !== id)
      : [...selectedValues, id];
    onChange(newValues);
  };

  const removeValue = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== id));
  };

  return (
    <div className={`relative ${label ? 'space-y-2' : ''} ${isOpen ? 'z-[110]' : 'z-10'}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">
          {label}
        </label>
      )}
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-4 bg-white border-[2.5px] transition-all rounded-2xl py-2.5 px-4 text-left shadow-sm cursor-pointer min-h-[56px] ${
          isOpen ? 'border-brand-dark ring-4 ring-brand-dark/5' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className={`p-2 rounded-xl transition-colors shrink-0 ${isOpen ? 'bg-brand-dark/10 text-brand-dark' : 'bg-slate-50 text-slate-400'}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        
        <div className="flex-1 flex flex-wrap gap-2 min-h-[24px] items-center">
          {selectedValues.length > 0 ? (
            selectedValues.map(val => {
              const opt = options.find(o => o.id === val);
              return (
                <span key={val} className="inline-flex items-center gap-1.5 bg-brand-dark/10 text-brand-dark px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-in zoom-in-95 border border-brand-dark/10">
                  {opt?.name}
                  <button onClick={(e) => removeValue(e, val)} className="hover:bg-brand-dark/20 rounded-md p-0.5 transition-colors">
                    <X size={12} strokeWidth={3} />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-slate-400 font-bold text-sm">{placeholder}</span>
          )}
        </div>

        <ChevronDown size={20} className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute z-[100] min-w-full md:w-full mt-2 bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => {
              const isSelected = selectedValues.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(opt.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-sm font-bold transition-all hover:bg-slate-50 ${
                    isSelected ? 'text-brand-dark bg-brand-dark/5' : 'text-slate-600'
                  }`}
                >
                  <span className="truncate pr-4">{opt.name}</span>
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                    isSelected ? 'bg-brand-dark border-brand-dark' : 'border-slate-200'
                  }`}>
                    {isSelected && <Check size={14} strokeWidth={4} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
