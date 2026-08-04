import { MaterialItem } from '../types';

let idc = 0;
const id = () => `mat-${++idc}`;

const m = (name: string, unit: string, defaultRate: number, category: string, supplier = ''): MaterialItem => ({
  id: id(), name, unit, defaultRate, category, supplier, remarks: ''
});

// Default rates are indicative (KES) and fully editable — every project should
// confirm current market rates before issuing a schedule.
export const defaultMaterials: MaterialItem[] = [
  m('Cement (50kg bag)', 'Bags', 880, 'Cement & Aggregates'),
  m('Sand', 'Tonnes', 2500, 'Cement & Aggregates'),
  m('Aggregate / Ballast', 'Tonnes', 2600, 'Cement & Aggregates'),
  m('Hardcore', 'Tonnes', 1500, 'Cement & Aggregates'),
  m('Lime', 'Bags', 850, 'Cement & Aggregates'),
  m('Machine cut stone (walling)', 'Pieces', 65, 'Walling'),
  m('Concrete blocks', 'No', 65, 'Walling'),
  m('Timber (sawn, general)', 'Metres', 250, 'Timber'),
  m('Marine plyboard 1200x2400mm', 'No', 3200, 'Timber'),
  m('Gumpoles', 'No', 350, 'Timber'),
  m('Reinforcement bars (mixed sizes)', 'Kg', 130, 'Steel'),
  m('Binding wire (25kg roll)', 'Rolls', 4350, 'Steel'),
  m('Fabric mesh A142', 'Rolls', 34500, 'Steel'),
  m('Hoop iron 20mm (20kg roll)', 'Rolls', 3500, 'Steel'),
  m('Roofing sheets (28G box profile)', 'Pieces', 2500, 'Roofing'),
  m('Ridge caps', 'Pieces', 1500, 'Roofing'),
  m('Roofing nails', 'Kg', 250, 'Roofing'),
  m('Gutters 150mm dia (4m)', 'Piece', 1500, 'Roofing'),
  m('Downpipes 150mm dia (4m)', 'Piece', 1400, 'Roofing'),
  m('Glazed ceramic floor tiles', 'SM', 1200, 'Finishes'),
  m('PVC floor tiles', 'SM', 900, 'Finishes'),
  m('Paint - emulsion', 'Litres', 500, 'Paint'),
  m('Paint - gloss enamel', 'Litres', 950, 'Paint'),
  m('Varnish / polyurethane', 'Litres', 1600, 'Paint'),
  m('Anti-termite chemical', 'Litres', 6000, 'Chemicals'),
  m('Polythene DPM (1000g roll)', 'Rolls', 3000, 'Waterproofing'),
  m('Damp proof course roll', 'Rolls', 3200, 'Waterproofing'),
  m('Steel door (1000x2100mm)', 'No', 11800, 'Doors'),
  m('Steel door (1500x2500mm)', 'No', 21000, 'Doors'),
  m('Aluminium window', 'SM', 9500, 'Windows'),
  m('Water tank 5000L', 'No', 43870, 'Fittings'),
];

export const materialCategories = Array.from(new Set(defaultMaterials.map(m => m.category || 'General')));
