import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileSpreadsheet, Library, SlidersHorizontal, Banknote,
  BarChart3, Settings as SettingsIcon, FolderOpen, HardHat, X
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Open Existing Project', icon: FolderOpen },
  { to: '/materials', label: 'Material Library', icon: Library },
  { to: '/conversion-factors', label: 'Conversion Factors', icon: SlidersHorizontal },
  { to: '/rates', label: 'Rates Library', icon: Banknote },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { currentProject } = useAppData();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden no-print" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 bg-blueprint-900 text-blueprint-50 flex flex-col transition-transform duration-200 no-print
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center">
              <HardHat size={20} className="text-blueprint-950" />
            </div>
            <div>
              <div className="font-display font-semibold leading-tight text-[15px]">Material Schedule</div>
              <div className="text-[11px] text-blueprint-300 tracking-wide">CALCULATOR PRO</div>
            </div>
          </div>
          <button className="lg:hidden text-blueprint-300" onClick={onClose}><X size={20} /></button>
        </div>

        {currentProject && (
          <div className="mx-4 mt-4 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wide text-blueprint-300">Active Project</div>
            <div className="text-sm font-medium truncate">{currentProject.info.projectName}</div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber-400 text-blueprint-950' : 'text-blueprint-200 hover:bg-white/10'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
          {currentProject && (
            <div className="pt-3 mt-3 border-t border-white/10">
              <div className="px-3 pb-1 text-[10px] uppercase tracking-wide text-blueprint-400">Worksheets</div>
              {currentProject.worksheets.map(ws => (
                <NavLink
                  key={ws.id}
                  to={`/worksheet/${ws.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                      isActive ? 'bg-white/15 text-white' : 'text-blueprint-300 hover:bg-white/10'
                    }`
                  }
                >
                  <FileSpreadsheet size={14} />
                  <span className="truncate">{ws.title}</span>
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        <div className="px-4 py-4 text-[11px] text-blueprint-400 border-t border-white/10">
          For Quantity Surveyors, Engineers &amp; Contractors
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
