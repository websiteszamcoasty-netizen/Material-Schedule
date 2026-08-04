import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight, Copy, Trash2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { ProjectInfo } from '../types';

const ProjectInfoPage: React.FC = () => {
  const { currentProject, updateProjectInfo, createProject, cloneProject, deleteProject } = useAppData();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isDirty } } = useForm<ProjectInfo>({
    defaultValues: currentProject?.info
  });

  if (!currentProject) {
    return (
      <div className="card p-8 text-center">
        <p className="text-blueprint-500 dark:text-blueprint-300 mb-4">No active project yet.</p>
        <button className="btn-primary mx-auto" onClick={() => { createProject(); }}>Create New Material Schedule</button>
      </div>
    );
  }

  const onSubmit = (data: ProjectInfo) => {
    updateProjectInfo(data);
  };

  const fields: { name: keyof ProjectInfo; label: string; type?: string }[] = [
    { name: 'projectName', label: 'Project Name' },
    { name: 'client', label: 'Client' },
    { name: 'consultant', label: 'Consultant' },
    { name: 'contractor', label: 'Contractor' },
    { name: 'location', label: 'Location' },
    { name: 'boqReference', label: 'BOQ Reference' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'preparedBy', label: 'Prepared By' },
    { name: 'revision', label: 'Revision' },
    { name: 'currency', label: 'Currency' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Project Information</h1>
        <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1">
          These details are placed automatically on every worksheet, Excel export, PDF report and summary page.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.name} className={f.name === 'projectName' ? 'sm:col-span-2' : ''}>
            <label className="label">{f.label}</label>
            <input className="input" type={f.type || 'text'} {...register(f.name)} />
          </div>
        ))}
        <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
          <button type="submit" className="btn-primary">
            <Save size={16} /> {isDirty ? 'Save Changes' : 'Saved'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/worksheet/${currentProject.worksheets[0]?.id}`)}
          >
            Continue to Worksheets <ArrowRight size={16} />
          </button>
          <button type="button" className="btn-ghost ml-auto" onClick={() => cloneProject(currentProject.id)}>
            <Copy size={16} /> Clone Project
          </button>
          <button
            type="button"
            className="btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => {
              if (confirm('Delete this project? This cannot be undone.')) {
                deleteProject(currentProject.id);
                navigate('/');
              }
            }}
          >
            <Trash2 size={16} /> Delete Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectInfoPage;
