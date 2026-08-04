import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Copy, Trash2, PlusCircle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { projectGrandTotal, formatCurrency } from '../utils/calculations';

const ProjectsPage: React.FC = () => {
  const { projects, openProject, cloneProject, deleteProject, createProject } = useAppData();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1">Open, clone or remove a saved material schedule.</p>
        </div>
        <button className="btn-primary" onClick={() => { createProject(); navigate('/project/info'); }}>
          <PlusCircle size={16} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card p-10 text-center text-blueprint-500 dark:text-blueprint-300">
          No projects yet. Create a new material schedule or load the sample project from the Dashboard.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...projects].reverse().map(p => (
            <div key={p.id} className="card p-5 flex flex-col gap-3">
              <div>
                <div className="font-medium">{p.info.projectName}</div>
                <div className="text-xs text-blueprint-500 dark:text-blueprint-300 mt-0.5">
                  {p.info.client || 'No client set'} · {p.info.location || 'No location'}
                </div>
                <div className="text-xs text-blueprint-400 mt-0.5">Updated {new Date(p.updatedAt).toLocaleString()}</div>
              </div>
              <div className="text-lg font-semibold text-blueprint-700 dark:text-amber-400">
                {formatCurrency(projectGrandTotal(p.worksheets), p.info.currency)}
              </div>
              <div className="flex gap-2 mt-auto pt-2 border-t border-blueprint-100 dark:border-graphite-800">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => { openProject(p.id); navigate('/project/info'); }}
                >
                  <FolderOpen size={15} /> Open
                </button>
                <button className="btn-ghost !px-2" title="Clone" onClick={() => cloneProject(p.id)}>
                  <Copy size={15} />
                </button>
                <button
                  className="btn-ghost !px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Delete"
                  onClick={() => { if (confirm(`Delete "${p.info.projectName}"?`)) deleteProject(p.id); }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
