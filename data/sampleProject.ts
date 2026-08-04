import { Project, ProjectInfo, ScheduleRow, Worksheet, MaterialItem } from '../types';
import { elementTemplates } from './elementTemplates';
import { uid } from '../utils/id';
import { computeRow } from '../utils/calculations';

// Recreates the worked example from the uploaded Material Schedule Template
// (F4E/37-C/2026 — Proposed Four Decentralized Cooking Facilities, Tetu, Nyeri
// County) so a new user can see the calculator working end-to-end immediately.

const sampleInputs: Record<string, Record<string, number>> = {
  substructures: {
    A: 21, B: 70, C: 83, D: 83, E: 38, F: 38, G: 38, H: 23, I: 23, J: 23,
    K: 40, L: 40, M: 40, N: 40, O: 75, P: 109, Q: 184, R: 94, S: 8, T: 6
  },
  'rc-frame': {
    A: 2, B: 2, C: 2, D: 0.2, E: 0.2, F: 0.2, G: 52, H: 0, I: 146, J: 0, K: 0,
    L: 198, M: 4, N: 29, O: 15
  },
  walling: {
    A: 89, B: 89, C: 87, D: 2, E: 89, F: 41, G: 5, H: 5, I: 5, J: 5, K: 22, L: 22, M: 22
  },
  roofing: {
    A: 142, B: 131, C: 31, D: 46, E: 350, F: 63, G: 63, H: 107, I: 6, J: 13,
    K: 31, L: 12, M: 4, N: 4, O: 43, P: 43
  },
  'external-finishes': {
    A: 15, B: 15, C: 15, D: 15, E: 15, F: 56, G: 56, H: 34, I: 34, J: 11, K: 11
  },
  'internal-finishes': {
    A: 94, B: 94, C: 94, D: 94, E: 94, F: 52, G: 52, H: 26, I: 26, J: 20, K: 20,
    L: 6, M: 10, N: 6, O: 6
  },
  windows: { A: 32, B: 14, C: 44, D: 37, E: 123, F: 6, G: 14, H: 14 },
  doors: { A: 2, B: 1, C: 16 }
};

export function buildSampleProject(materials: MaterialItem[]): Project {
  const info: ProjectInfo = {
    projectName: 'Proposed Four (4No.) Decentralized Cooking Facilities',
    client: 'Food For Education Foundation',
    consultant: 'Mavencraft Ltd',
    contractor: 'To be appointed',
    location: 'Tetu, Nyeri County',
    boqReference: 'F4E/37-C/2026',
    date: new Date().toISOString().slice(0, 10),
    preparedBy: 'Sample Data',
    revision: 'Rev A',
    currency: 'KES'
  };

  const worksheets: Worksheet[] = elementTemplates.map(t => {
    const inputs = sampleInputs[t.key] || {};
    const rows: ScheduleRow[] = t.rows.map(r => {
      const mat = materials.find(m => m.name === r.materialName);
      const row: ScheduleRow = {
        id: uid('row'),
        ref: r.ref,
        description: r.description,
        subheading: r.subheading,
        unit: r.unit,
        inputQty: r.subheading ? null : (inputs[r.ref] ?? null),
        factor: r.defaultFactor,
        qty: null,
        rate: mat?.defaultRate ?? null,
        amount: null,
        remarks: '',
        materialId: mat?.id
      };
      return computeRow(row);
    });
    return {
      id: uid('ws'),
      elementKey: t.key,
      title: t.title,
      group: t.group,
      rows
    };
  });

  return {
    id: uid('proj'),
    info,
    worksheets,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
