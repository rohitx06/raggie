import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Database,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/chatbots', icon: Bot, label: 'Chatbots' },
  { to: '/knowledge', icon: Database, label: 'Knowledge Bases' },
  { to: '/conversations', icon: MessageSquare, label: 'Conversations' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-900/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen flex flex-col bg-white border-r border-surface-200/80 transition-all duration-300 ease-in-out shadow-sm',
          'lg:relative lg:translate-x-0',
          collapsed ? 'lg:w-16' : 'lg:w-60',
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-surface-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20 group hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white animate-pulse-subtle" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="font-bold text-surface-900 text-sm leading-tight block truncate gradient-text">
                RAG Platform
              </span>
              <span className="text-[11px] text-surface-400 font-medium block truncate">Linode Cloud</span>
            </div>
          )}
          <button
            onClick={onMobileClose}
            className="lg:hidden text-surface-400 hover:text-surface-600 ml-auto p-1 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-brand-50/80 text-brand-700 font-semibold shadow-sm'
                    : 'text-surface-600 hover:bg-surface-100/70 hover:text-surface-900 hover:translate-x-0.5'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left active border indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-600 rounded-r-full" />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110',
                      isActive ? 'text-brand-600' : 'text-surface-400 group-hover:text-surface-700'
                    )}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:flex items-center justify-end px-3 py-3 border-t border-surface-100">
          <button
            onClick={onCollapse}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-all hover:scale-105 active:scale-95"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
