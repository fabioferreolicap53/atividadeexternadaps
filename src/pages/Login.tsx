import React, { useState } from 'react';
import { Mail, Lock, LogIn, CalendarCheck, ShieldCheck } from 'lucide-react';
import pb from '../lib/pocketbase';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Tentativa de login real via PocketBase (Versão Online)
      await pb.collection('users').authWithPassword(email, password);
      onLogin();
    } catch (err: any) {
      // Fallback para as credenciais padrão (visto na implementação local)
      if (email === 'daps.cap53@gmail.com' && password === 'daps2022') {
        // Se falhar o PocketBase mas for a credencial mestre, autentica localmente
        localStorage.setItem('daps_auth', 'true');
        onLogin();
      } else {
        setError('E-mail ou senha incorretos. Tente novamente.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1C2E4A] flex items-center justify-center p-4 font-headline antialiased overflow-hidden relative">
      {/* Decorative background elements (no images) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 group">
          <div className="relative w-20 h-20 flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-full h-full bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md">
              <CalendarCheck className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" size={40} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Atividades<span className="text-white/40">.</span>
          </h1>
          <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em]">
            Externas DAPS
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Acesso Restrito</h2>
            <p className="text-white/40 text-sm">Entre com suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full bg-white/5 border-2 border-white/10 focus:border-white/20 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border-2 border-white/10 focus:border-white/20 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-error/20 border border-error/40 p-4 rounded-2xl animate-in shake duration-300 shadow-[0_0_20px_rgba(186,26,26,0.15)]">
                <p className="text-error-container text-[11px] font-black text-center uppercase tracking-wider">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-[#1C2E4A] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-sm shadow-[0_12px_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#1C2E4A]/20 border-t-[#1C2E4A] rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} strokeWidth={3} />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-2 opacity-30">
            <ShieldCheck size={14} className="text-white" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Ambiente Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
