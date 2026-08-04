import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

interface Hit {
  type: 'Worksheet' | 'Material' | 'Reference' | 'Supplier';
  label: string;
  sub: string;
  onGo: () => void;
}

const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { currentProject, materials, settings, toggleDarkMode } = useAppData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const hits: Hit[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: Hit[] = [];

    if (currentProject) {
      for (const ws of currentProject.worksheets) {
        if (ws.title.toLowerCase().includes(q)) {
          results.push({ type: 'Worksheet', label: ws.title, sub: 'Worksheet', onGo: () => navigate(`/worksheet/${ws.id}`) });
        }
        for (const row of ws.rows) {
          if (row.description.toLowerCase().includes(q) || row.ref.toLowerCase() === q) {
            results.push({
              type: 'Reference',
              label: `${row.ref ? row.ref + ' — ' : ''}${row.description}`,
              sub: ws.title,
              onGo: () => navigate(`/worksheet/${ws.id}`)
            });
          }
        }
      }
    }
    for (const m of materials) {
      if (m.name.toLowerCase().includes(q)) {
        results.push({ type: 'Material', label: m.name, sub: m.unit, onGo: () => navigate('/materials') });
      }
      if (m.supplier && m.supplier.toLowerCase().includes(q)) {
        results.push({ type: 'Supplier', label: m.supplier, sub: m.name, onGo: () => navigate('/materials') });
      }
    }
    return results.slice(0, 12);
  }, [query, currentProject, materials, navigate]);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 py-3 bg-white/90 dark:bg-graphite-900/90 backdrop-blur border-b border-blueprint-100 dark:border-graphite-800 no-print">
      <button className="lg:hidden btn-ghost !px-2" onClick={onMenuClick}><Menu size={20} /></button>

      <div className="relative flex-1 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blueprint-400" />
        <input
          className="input pl-9 pr-8"
          placeholder="Search materials, worksheets, references, suppliers..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        {query && (
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blueprint-400" onClick={() => setQuery('')}>
            <X size={14} />
          </button>
        )}
        {focused && hits.length > 0 && (
          <div className="absolute mt-1 w-full card z-30 max-h-80 overflow-y-auto py-1">
            {hits.map((h, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 hover:bg-blueprint-50 dark:hover:bg-graphite-800 flex items-center justify-between gap-3"
                onMouseDown={() => { h.onGo(); setQuery(''); }}
              >
                <span className="text-sm truncate">{h.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-blueprint-400 shrink-0">{h.type} · {h.sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {currentProject && (
          <span className="hidden md:inline text-sm text-blueprint-500 dark:text-blueprint-300 mr-1">
            {currentProject.info.projectName}
          </span>
        )}
        <button className="btn-ghost !px-2" onClick={toggleDarkMode} title="Toggle dark / light mode">
          {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
