// Core domain types for Material Schedule Calculator Pro

export interface ProjectInfo {
  projectName: string;
  client: string;
  consultant: string;
  contractor: string;
  location: string;
  boqReference: string;
  date: string;
  preparedBy: string;
  revision: string;
  currency: string;
  logoDataUrl?: string;
}

export interface ScheduleRow {
  id: string;
  ref: string;                 // A, B, C...
  description: string;
  subheading?: boolean;        // true if this row is a mix/section subheading (no calc)
  unit: string;
  inputQty: number | null;
  factor: number | null;       // resolved factor value (editable override)
  qty: number | null;          // calculated = inputQty * factor
  rate: number | null;         // editable rate (may link to RateItem)
  amount: number | null;       // qty * rate
  remarks?: string;
  materialId?: string;         // link into Material Library for summary rollup
}

export interface Worksheet {
  id: string;
  elementKey: string;          // e.g. 'substructures'
  title: string;                // e.g. 'Substructures'
  group: string;                 // Substructures, RC Frame, Walling, Doors, Windows, Roofing, Finishes, Fittings, External Works
  rows: ScheduleRow[];
  notes?: string;
}

export interface ConversionFactor {
  id: string;
  category: string;      // Earthworks, Concrete, Mortar, Reinforcement, Roofing, Finishes, Painting...
  subcategory: string;   // e.g. 'Concrete Mix 1:1.5:3'
  material: string;      // Cement, Sand, Aggregate...
  unit: string;
  factor: number;        // quantity of material per 1 unit of input
  basis: string;         // e.g. 'per CM of mixed concrete'
  source: 'document' | 'industry-standard' | 'custom';
  editable: boolean;
  notes?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  unit: string;
  defaultRate: number;
  supplier?: string;
  remarks?: string;
  category?: string;
}

export interface ElementTemplateRow {
  ref: string;
  description: string;
  subheading?: boolean;
  unit: string;
  defaultFactor: number | null;
  materialName?: string;
  category?: string;
}

export interface ElementTemplate {
  key: string;
  title: string;
  group: string;
  rows: ElementTemplateRow[];
}

export interface Project {
  id: string;
  info: ProjectInfo;
  worksheets: Worksheet[];
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  currency: string;
  taxPercent: number;
  markupPercent: number;
  wasteFactorPercent: number;
  labourFactorPercent: number;
  regionalRateAdjustmentPercent: number;
  measurementUnits: 'metric' | 'imperial';
  darkMode: boolean;
}
