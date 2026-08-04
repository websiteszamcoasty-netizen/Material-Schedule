import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  Project, ProjectInfo, Worksheet, ScheduleRow, MaterialItem, ConversionFactor, Settings
} from '../types';
import { defaultConversionFactors } from '../data/conversionFactors';
import { defaultMaterials } from '../data/materials';
import { elementTemplates } from '../data/elementTemplates';
import { uid } from '../utils/id';
import { computeRow } from '../utils/calculations';
import { buildSampleProject } from '../data/sampleProject';

const STORAGE_KEY = 'msc-app-data-v1';

interface AppData {
  projects: Project[];
  currentProjectId: string | null;
  materials: MaterialItem[];
  conversionFactors: ConversionFactor[];
  settings: Settings;
}

const defaultSettings: Settings = {
  currency: 'KES',
  taxPercent: 16,
  markupPercent: 10,
  wasteFactorPercent: 5,
  labourFactorPercent: 0,
  regionalRateAdjustmentPercent: 0,
  measurementUnits: 'metric',
  darkMode: false
};

function blankProjectInfo(): ProjectInfo {
  return {
    projectName: 'Untitled Project',
    client: '',
    consultant: '',
    contractor: '',
    location: '',
    boqReference: '',
    date: new Date().toISOString().slice(0, 10),
    preparedBy: '',
    revision: 'Rev A',
    currency: 'KES'
  };
}

function emptyRow(): ScheduleRow {
  return {
    id: uid('row'),
    ref: '',
    description: '',
    unit: '',
    inputQty: null,
    factor: null,
    qty: null,
    rate: null,
    amount: null,
    remarks: ''
  };
}

function newWorksheetsFromTemplates(materials: MaterialItem[]): Worksheet[] {
  return elementTemplates.map(t => ({
    id: uid('ws'),
    elementKey: t.key,
    title: t.title,
    group: t.group,
    rows: t.rows.map(r => {
      const mat = materials.find(m => m.name === r.materialName);
      const row: ScheduleRow = {
        id: uid('row'),
        ref: r.ref,
        description: r.description,
        subheading: r.subheading,
        unit: r.unit,
        inputQty: null,
        factor: r.defaultFactor,
        qty: null,
        rate: mat?.defaultRate ?? null,
        amount: null,
        remarks: '',
        materialId: mat?.id
      };
      return computeRow(row);
    })
  }));
}

function loadInitial(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      if (parsed && parsed.materials && parsed.conversionFactors && parsed.settings) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load stored data, starting fresh.', e);
  }
  return {
    projects: [],
    currentProjectId: null,
    materials: defaultMaterials,
    conversionFactors: defaultConversionFactors,
    settings: defaultSettings
  };
}

interface AppDataContextValue {
  projects: Project[];
  currentProject: Project | null;
  materials: MaterialItem[];
  conversionFactors: ConversionFactor[];
  settings: Settings;

  createProject: (info?: Partial<ProjectInfo>) => string;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
  cloneProject: (id: string) => string;
  updateProjectInfo: (info: Partial<ProjectInfo>) => void;
  loadSample: () => void;

  addWorksheet: (title: string, group: string, rows?: ScheduleRow[]) => void;
  removeWorksheet: (worksheetId: string) => void;
  updateWorksheetRow: (worksheetId: string, rowId: string, patch: Partial<ScheduleRow>) => void;
  addWorksheetRow: (worksheetId: string) => void;
  removeWorksheetRow: (worksheetId: string, rowId: string) => void;
  reorderWorksheetRow: (worksheetId: string, rowId: string, direction: 'up' | 'down') => void;

  addMaterial: (m: Omit<MaterialItem, 'id'>) => void;
  updateMaterial: (id: string, patch: Partial<MaterialItem>) => void;
  removeMaterial: (id: string) => void;

  addConversionFactor: (cf: Omit<ConversionFactor, 'id'>) => void;
  updateConversionFactor: (id: string, patch: Partial<ConversionFactor>) => void;
  removeConversionFactor: (id: string) => void;

  updateSettings: (patch: Partial<Settings>) => void;
  toggleDarkMode: () => void;

  resetAllData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.settings.darkMode);
  }, [data.settings.darkMode]);

  const currentProject = useMemo(
    () => data.projects.find(p => p.id === data.currentProjectId) || null,
    [data.projects, data.currentProjectId]
  );

  const createProject = useCallback((info?: Partial<ProjectInfo>) => {
    let newId = '';
    setData(prev => {
      const id = uid('proj');
      newId = id;
      const project: Project = {
        id,
        info: { ...blankProjectInfo(), ...info },
        worksheets: newWorksheetsFromTemplates(prev.materials),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { ...prev, projects: [...prev.projects, project], currentProjectId: id };
    });
    return newId;
  }, []);

  const openProject = useCallback((id: string) => {
    setData(prev => ({ ...prev, currentProjectId: id }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      currentProjectId: prev.currentProjectId === id ? null : prev.currentProjectId
    }));
  }, []);

  const cloneProject = useCallback((id: string) => {
    let newId = '';
    setData(prev => {
      const src = prev.projects.find(p => p.id === id);
      if (!src) return prev;
      newId = uid('proj');
      const clone: Project = {
        ...src,
        id: newId,
        info: { ...src.info, projectName: `${src.info.projectName} (Copy)` },
        worksheets: src.worksheets.map(ws => ({ ...ws, id: uid('ws'), rows: ws.rows.map(r => ({ ...r, id: uid('row') })) })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { ...prev, projects: [...prev.projects, clone], currentProjectId: newId };
    });
    return newId;
  }, []);

  const updateProjectInfo = useCallback((info: Partial<ProjectInfo>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === prev.currentProjectId
          ? { ...p, info: { ...p.info, ...info }, updatedAt: new Date().toISOString() }
          : p
      )
    }));
  }, []);

  const loadSample = useCallback(() => {
    setData(prev => {
      const sample = buildSampleProject(prev.materials);
      return { ...prev, projects: [...prev.projects, sample], currentProjectId: sample.id };
    });
  }, []);

  const mutateWorksheets = useCallback((fn: (worksheets: Worksheet[]) => Worksheet[]) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === prev.currentProjectId
          ? { ...p, worksheets: fn(p.worksheets), updatedAt: new Date().toISOString() }
          : p
      )
    }));
  }, []);

  const addWorksheet = useCallback((title: string, group: string, rows?: ScheduleRow[]) => {
    mutateWorksheets(ws => [...ws, {
      id: uid('ws'), elementKey: uid('el'), title, group, rows: rows && rows.length ? rows : [emptyRow()]
    }]);
  }, [mutateWorksheets]);

  const removeWorksheet = useCallback((worksheetId: string) => {
    mutateWorksheets(ws => ws.filter(w => w.id !== worksheetId));
  }, [mutateWorksheets]);

  const updateWorksheetRow = useCallback((worksheetId: string, rowId: string, patch: Partial<ScheduleRow>) => {
    mutateWorksheets(ws => ws.map(w => {
      if (w.id !== worksheetId) return w;
      return {
        ...w,
        rows: w.rows.map(r => (r.id === rowId ? computeRow({ ...r, ...patch }) : r))
      };
    }));
  }, [mutateWorksheets]);

  const addWorksheetRow = useCallback((worksheetId: string) => {
    mutateWorksheets(ws => ws.map(w => (w.id === worksheetId ? { ...w, rows: [...w.rows, emptyRow()] } : w)));
  }, [mutateWorksheets]);

  const removeWorksheetRow = useCallback((worksheetId: string, rowId: string) => {
    mutateWorksheets(ws => ws.map(w => (w.id === worksheetId ? { ...w, rows: w.rows.filter(r => r.id !== rowId) } : w)));
  }, [mutateWorksheets]);

  const reorderWorksheetRow = useCallback((worksheetId: string, rowId: string, direction: 'up' | 'down') => {
    mutateWorksheets(ws => ws.map(w => {
      if (w.id !== worksheetId) return w;
      const idx = w.rows.findIndex(r => r.id === rowId);
      if (idx < 0) return w;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= w.rows.length) return w;
      const rows = [...w.rows];
      [rows[idx], rows[targetIdx]] = [rows[targetIdx], rows[idx]];
      return { ...w, rows };
    }));
  }, [mutateWorksheets]);

  const addMaterial = useCallback((m: Omit<MaterialItem, 'id'>) => {
    setData(prev => ({ ...prev, materials: [...prev.materials, { ...m, id: uid('mat') }] }));
  }, []);

  const updateMaterial = useCallback((id: string, patch: Partial<MaterialItem>) => {
    setData(prev => ({ ...prev, materials: prev.materials.map(m => (m.id === id ? { ...m, ...patch } : m)) }));
  }, []);

  const removeMaterial = useCallback((id: string) => {
    setData(prev => ({ ...prev, materials: prev.materials.filter(m => m.id !== id) }));
  }, []);

  const addConversionFactor = useCallback((cf: Omit<ConversionFactor, 'id'>) => {
    setData(prev => ({ ...prev, conversionFactors: [...prev.conversionFactors, { ...cf, id: uid('cf') }] }));
  }, []);

  const updateConversionFactor = useCallback((id: string, patch: Partial<ConversionFactor>) => {
    setData(prev => ({
      ...prev,
      conversionFactors: prev.conversionFactors.map(cf => (cf.id === id ? { ...cf, ...patch } : cf))
    }));
  }, []);

  const removeConversionFactor = useCallback((id: string) => {
    setData(prev => ({ ...prev, conversionFactors: prev.conversionFactors.filter(cf => cf.id !== id) }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, darkMode: !prev.settings.darkMode } }));
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData({
      projects: [],
      currentProjectId: null,
      materials: defaultMaterials,
      conversionFactors: defaultConversionFactors,
      settings: defaultSettings
    });
  }, []);

  const value: AppDataContextValue = {
    projects: data.projects,
    currentProject,
    materials: data.materials,
    conversionFactors: data.conversionFactors,
    settings: data.settings,
    createProject,
    openProject,
    deleteProject,
    cloneProject,
    updateProjectInfo,
    loadSample,
    addWorksheet,
    removeWorksheet,
    updateWorksheetRow,
    addWorksheetRow,
    removeWorksheetRow,
    reorderWorksheetRow,
    addMaterial,
    updateMaterial,
    removeMaterial,
    addConversionFactor,
    updateConversionFactor,
    removeConversionFactor,
    updateSettings,
    toggleDarkMode,
    resetAllData
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
