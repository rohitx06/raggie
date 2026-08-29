import { useState } from 'react';
import { User, Palette, Cpu, Database, Shield, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

const SECTIONS = [
  { key: 'profile', icon: User, label: 'Profile' },
  { key: 'appearance', icon: Palette, label: 'Appearance' },
  { key: 'ai', icon: Cpu, label: 'AI Configuration' },
  { key: 'kb', icon: Database, label: 'Knowledge Base Defaults' },
  { key: 'security', icon: Shield, label: 'Security' },
];

export function Settings() {
  const [active, setActive] = useState('profile');
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account, preferences, and platform configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="w-full lg:w-56 shrink-0">
          <div className="card p-2 space-y-0.5">
            {SECTIONS.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors',
                  active === key ? 'bg-brand-50 text-brand-700' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                )}
              >
                <Icon className={cn('w-4 h-4', active === key ? 'text-brand-600' : 'text-surface-400')} />
                {label}
                {active === key && <ChevronRight className="ml-auto w-3.5 h-3.5 text-brand-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {active === 'profile' && (
            <div className="card p-6 space-y-5">
              <h2 className="section-title">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-brand-600" />
                </div>
                <div>
                  <button className="btn-secondary btn-sm">Change Avatar</button>
                  <p className="text-xs text-surface-400 mt-1">JPG, PNG or GIF up to 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input defaultValue="Admin" className="input" />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input defaultValue="User" className="input" />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input defaultValue="admin@ragplatform.com" type="email" className="input" />
              </div>
              <div>
                <label className="label">Organization</label>
                <input defaultValue="My Organization" className="input" />
              </div>
            </div>
          )}

          {active === 'appearance' && (
            <div className="card p-6 space-y-5">
              <h2 className="section-title">Appearance</h2>
              <div>
                <label className="label">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light' },
                    { id: 'dark', label: 'Dark' },
                    { id: 'system', label: 'System' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        'p-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between',
                        theme === t.id
                          ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-sm'
                          : 'border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-700'
                      )}
                    >
                      {t.label}
                      {theme === t.id && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Language</label>
                <select className="input max-w-xs">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          )}

          {active === 'ai' && (
            <div className="card p-6 space-y-5">
              <h2 className="section-title">AI Configuration</h2>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700">API keys are stored securely in the backend and never exposed to the browser. These are UI placeholders for Phase 1.</p>
              </div>
              <div>
                <label className="label">Default Model</label>
                <select className="input max-w-xs">
                  <option>GPT-OSS 120B</option>
                  <option>GPT-OSS 70B</option>
                  <option>Llama 3.1 405B</option>
                </select>
              </div>
              <div>
                <label className="label">Default Provider</label>
                <select className="input max-w-xs">
                  <option>Groq</option>
                  <option>OpenAI</option>
                  <option>Anthropic</option>
                </select>
              </div>
              <div>
                <label className="label">Default Temperature</label>
                <input type="number" defaultValue={0.2} min={0} max={1} step={0.1} className="input max-w-xs" />
              </div>
              <div>
                <label className="label">Dify API Endpoint</label>
                <input defaultValue="https://api.dify.ai/v1" className="input" readOnly />
                <p className="text-xs text-surface-400 mt-1">Configured in backend environment variables. Read-only.</p>
              </div>
            </div>
          )}

          {active === 'kb' && (
            <div className="card p-6 space-y-5">
              <h2 className="section-title">Knowledge Base Defaults</h2>
              <div>
                <label className="label">Default Embedding Model</label>
                <select className="input max-w-xs">
                  <option>BGE-small-en-v1.5</option>
                  <option>text-embedding-3-small</option>
                  <option>text-embedding-ada-002</option>
                </select>
              </div>
              <div>
                <label className="label">Default Retrieval Strategy</label>
                <select className="input max-w-xs">
                  <option>Hybrid Search</option>
                  <option>Semantic Search</option>
                  <option>Full-text Search</option>
                </select>
              </div>
              <div>
                <label className="label">Default Chunking Strategy</label>
                <select className="input max-w-xs">
                  <option>Paragraph</option>
                  <option>Fixed Size</option>
                  <option>Sentence</option>
                </select>
              </div>
              <div>
                <label className="label">Top K (retrieved chunks)</label>
                <input type="number" defaultValue={5} min={1} max={20} className="input max-w-xs" />
              </div>
            </div>
          )}

          {active === 'security' && (
            <div className="card p-6 space-y-5">
              <h2 className="section-title">Security</h2>
              <div>
                <label className="label">Current Password</label>
                <input type="password" placeholder="••••••••" className="input max-w-sm" />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" placeholder="••••••••" className="input max-w-sm" />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="input max-w-sm" />
              </div>
              <div className="border-t border-surface-100 pt-5">
                <h3 className="text-sm font-semibold text-surface-900 mb-3">API Keys</h3>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs text-red-700">
                    <strong>Security note:</strong> API keys (Dify, Groq) are configured as environment variables on the server and are never stored in the frontend or database.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="btn-primary">
              {saved ? <><Check className="w-4 h-4" />Saved!</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
