import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle, FolderOpen, Upload, Library, SlidersHorizontal, Banknote,
  BarChart3, Settings as SettingsIcon, Sparkles, ArrowRight
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { worksheetTotal, projectGrandTotal, formatCurrency } from '../utils/calculations';

const tiles = [
  { to: '/project/info', label: 'Create New Material Schedule', desc: 'Start a fresh project with all element worksheets pre-built', icon: PlusCircle, action: 'create' as const },
  { to: '/projects', label: 'Open Existing Project', desc: 'Resume work on a saved schedule', icon: FolderOpen },
  { to: '/import', label: 'Import BOQ', desc: 'Bring in quantities from Excel or CSV', icon: Upload },
  { to: '/materials', label: 'Material Library', desc: 'Manage materials, units and default rates', icon: Library },
  { to: '/conversion-factors', label: 'Conversion Factors', desc: 'Edit factors used to calculate material quantities', icon: SlidersHorizontal },
  { to: '/rates', label: 'Rates Library', desc: 'Keep material rates current for every schedule', icon: Banknote },
  { to: '/reports', label: 'Reports', desc: 'Excel and PDF exports, summaries and charts', icon: BarChart3 },
  { to: '/settings', label: 'Settings', desc: 'Currency, tax, markup, waste and labour factors', icon: SettingsIcon },
];

const Dashboard: React.FC = () => {
  const { projects, currentProject, createProject, loadSample, openProject } = useAppData();
  const navigate = useNavigate();

  const handleTile = (t: typeof tiles[number]) => {
    if (t.action === 'create') {
      createProject();
      navigate('/project/info');
    } else {
      navigate(t.to);
    }
  };

  return (
    <div className="space-y-8">
      <div className="card p-6 bg-gradient-to-br from-blueprint-800 to-blueprint-700 text-white border-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1.5">Material Schedule Calculator Pro</div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold">Automatic material schedules, straight from your BOQ.</h1>
            <p className="text-blueprint-200 mt-2 max-w-2xl text-sm">
              Enter quantities, and conversion factors calculate material take-offs automatically —
              exactly like a professional QS workbook, with editable rates and instant Excel/PDF reports.
            </p>
          </div>
          <button className="btn-amber shrink-0" onClick={() => { loadSample(); navigate('/project/info'); }}>
            <Sparkles size={16} /> Load Sample Project
          </button>
        </div>
      </div>

      {currentProject && (
        <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="label mb-0.5">Active Project</div>
            <div className="font-medium text-lg">{currentProject.info.projectName}</div>
            <div className="text-sm text-blueprint-500 dark:text-blueprint-300">
              {currentProject.worksheets.length} worksheets · Grand total{' '}
              <span className="font-semibold text-blueprint-800 dark:text-amber-400">
                {formatCurrency(projectGrandTotal(currentProject.worksheets), currentProject.info.currency)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => navigate('/project/info')}>Project Info</button>
            <button className="btn-primary" onClick={() => navigate(`/worksheet/${currentProject.worksheets[0]?.id}`)}>
              Open First Worksheet <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {tiles.map(t => (
            <button
              key={t.label}
              onClick={() => handleTile(t)}
              className="card p-5 text-left hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <t.icon size={22} className="text-blueprint-600 dark:text-amber-400 mb-3" />
              <div className="font-medium text-sm">{t.label}</div>
              <div className="text-xs text-blueprint-500 dark:text-blueprint-300 mt-1">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {projects.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold mb-3">Recent Projects</h2>
          <div className="card divide-y divide-blueprint-100 dark:divide-graphite-800">
            {[...projects].reverse().slice(0, 6).map(p => (
              <button
                key={p.id}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-blueprint-50 dark:hover:bg-graphite-800/60"
                onClick={() => { openProject(p.id); navigate('/project/info'); }}
              >
                <div>
                  <div className="font-medium text-sm">{p.info.projectName}</div>
                  <div className="text-xs text-blueprint-500 dark:text-blueprint-300">
                    {p.info.location || 'No location set'} · Updated {new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm font-semibold text-blueprint-700 dark:text-amber-400">
                  {formatCurrency(projectGrandTotal(p.worksheets), p.info.currency)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
