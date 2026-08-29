import { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header({ onMobileMenuOpen }) {
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-surface-200 flex items-center gap-4 px-4 shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-md text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search knowledge bases, chatbots..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-surface-400 transition-shadow"
          />
        </div>
      </div>

      <div className="flex-1 sm:flex-none" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-md text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-600" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-surface-700">Admin</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-surface-400 transition-transform', userOpen && 'rotate-180')} />
          </button>

          {userOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-surface-200 shadow-lg z-20 py-1 animate-fade-in">
                <div className="px-3 py-2 border-b border-surface-100">
                  <p className="text-xs font-semibold text-surface-900">Admin User</p>
                  <p className="text-xs text-surface-400">admin@ragplatform.com</p>
                </div>
                <a href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                  <Settings className="w-3.5 h-3.5 text-surface-400" />
                  Settings
                </a>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
