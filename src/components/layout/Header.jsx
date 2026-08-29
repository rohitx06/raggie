import { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, User, LogOut, Settings, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header({ onMobileMenuOpen }) {
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-surface-200/80 flex items-center gap-4 px-6 shrink-0 sticky top-0 z-30 shadow-sm">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-xl text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-all active:scale-95"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
          <input
            type="text"
            placeholder="Search knowledge bases, chatbots..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-50/80 border border-surface-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white placeholder:text-surface-400 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex-1 sm:flex-none" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Live indicator badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-xs font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Dify Live Connected
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-all active:scale-95">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-surface-100/80 transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-surface-700">Admin</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-surface-400 transition-transform duration-200', userOpen && 'rotate-180')} />
          </button>

          {userOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-surface-200 shadow-xl z-20 py-1.5 animate-scale-in">
                <div className="px-4 py-2.5 border-b border-surface-100">
                  <p className="text-xs font-bold text-surface-900">Admin User</p>
                  <p className="text-xs text-surface-400">admin@ragplatform.com</p>
                </div>
                <a href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
                  <Settings className="w-4 h-4 text-surface-400" />
                  Settings
                </a>
                <div className="border-t border-surface-100 mt-1 pt-1">
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
