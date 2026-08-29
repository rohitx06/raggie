import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Database,
  FileText,
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
          className="fixed inset-0 z-40 bg-surface-900/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen flex flex-col bg-white border-r border-surface-200 transition-all duration-300 ease-in-out',
          // Desktop
          'lg:relative lg:translate-x-0',
          collapsed ? 'lg:w-16' : 'lg:w-60',
          // Mobile
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center gap-3 h-14 px-3 border-b border-surface-100 shrink-0')}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-surface-900 text-sm leading-tight block truncate">
                RAG Platform
              </span>
              <span className="text-xs text-surface-400 block truncate">Workspace</span>
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="lg:hidden text-surface-400 hover:text-surface-600 ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-brand-600' : 'text-surface-400 group-hover:text-surface-600'
                    )}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:flex items-center justify-end px-3 py-3 border-t border-surface-100">
          <button
            onClick={onCollapse}
            className="p-1.5 rounded-md text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
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
