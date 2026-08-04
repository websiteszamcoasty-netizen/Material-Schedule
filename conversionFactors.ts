import { ConversionFactor } from '../types';

// Conversion factors transcribed from "Conversion Factors for Preparing a Schedule
// of Materials" (Fred Mweu). Where the source document did not provide a figure,
// accepted Kenyan/East African construction-industry standard defaults are used
// instead and flagged as source: 'industry-standard'. ALL factors are editable
// from the Conversion Factors admin screen — nothing here is fixed at runtime.

let idc = 0;
const id = () => `cf-${++idc}`;

const factor = (
  category: string,
  subcategory: string,
  material: string,
  unit: string,
  factorValue: number,
  basis: string,
  source: ConversionFactor['source'] = 'document',
  notes?: string
): ConversionFactor => ({
  id: id(),
  category,
  subcategory,
  material,
  unit,
  factor: factorValue,
  basis,
  source,
  editable: true,
  notes
});

export const defaultConversionFactors: ConversionFactor[] = [
  // ---------------- EARTHWORKS ----------------
  factor('Earthworks', 'Hardcore filling 150mm', 'Hardcore', 'Tonnes', 0.25, 'per SM of filling'),
  factor('Earthworks', 'Hardcore filling 200mm', 'Hardcore', 'Tonnes', 0.33, 'per SM of filling'),
  factor('Earthworks', 'Hardcore filling 300mm', 'Hardcore', 'Tonnes', 0.50, 'per SM of filling'),
  factor('Earthworks', 'Anti-termite treatment (Adrex 48 / Gladiator)', 'Anti-termite chemical', 'Litres', 0.077, 'per SM (coverage 12.5-13 SM/litre)', 'document'),
  factor('Earthworks', 'Damp proof membrane 1000g (300mm side laps)', 'Polythene DPM', 'Rolls', 0.0715, 'per SM (2 rolls cover ~14 SM)', 'document'),
  factor('Earthworks', 'DPC 100mm wall width', 'Damp proof course roll', 'Rolls', 0.001, 'per LM of wall (998.5 LM/roll)', 'document'),
  factor('Earthworks', 'DPC 150mm wall width', 'Damp proof course roll', 'Rolls', 0.00143, 'per LM of wall (698.5 LM/roll)', 'document'),
  factor('Earthworks', 'DPC 200mm wall width', 'Damp proof course roll', 'Rolls', 0.002, 'per LM of wall (499.5 LM/roll)', 'document'),
  factor('Earthworks', 'DPC 250mm wall width', 'Damp proof course roll', 'Rolls', 0.0025, 'per LM of wall (399.4 LM/roll)', 'document'),

  // ---------------- CONCRETE MIXES (per CM of mixed concrete) ----------------
  factor('Concrete', 'Mix 1:1:2', 'Cement', 'Bags', 9.57, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:1:2', 'Sand', 'Tonnes', 1.22, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:1:2', 'Aggregate (coarse)', 'Tonnes', 1.08, 'per CM of mixed concrete'),

  factor('Concrete', 'Mix 1:1.5:3 (Class 25)', 'Cement', 'Bags', 6.96, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:1.5:3 (Class 25)', 'Sand', 'Tonnes', 0.58, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:1.5:3 (Class 25)', 'Aggregate (coarse)', 'Tonnes', 0.88, 'per CM of mixed concrete'),

  factor('Concrete', 'Mix 1:2:4 (Class 20)', 'Cement', 'Bags', 5.47, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:2:4 (Class 20)', 'Sand', 'Tonnes', 0.61, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:2:4 (Class 20)', 'Aggregate (coarse)', 'Tonnes', 1.18, 'per CM of mixed concrete'),

  factor('Concrete', 'Mix 1:3:6 (Blinding)', 'Cement', 'Bags', 3.83, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:3:6 (Blinding)', 'Sand', 'Tonnes', 0.64, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:3:6 (Blinding)', 'Aggregate (coarse)', 'Tonnes', 0.97, 'per CM of mixed concrete'),

  factor('Concrete', 'Mix 1:4:8', 'Cement', 'Bags', 2.95, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:4:8', 'Sand', 'Tonnes', 0.65, 'per CM of mixed concrete'),
  factor('Concrete', 'Mix 1:4:8', 'Aggregate (coarse)', 'Tonnes', 1.00, 'per CM of mixed concrete'),

  factor('Concrete', 'Site mixed water content 1:1:2', 'Water', 'Litres', 18, 'per mix (50kg cement bag basis)', 'document'),
  factor('Concrete', 'Site mixed water content 1:1.5:3', 'Water', 'Litres', 20, 'per mix (50kg cement bag basis)', 'document'),
  factor('Concrete', 'Site mixed water content 1:2:4', 'Water', 'Litres', 22, 'per mix (50kg cement bag basis)', 'document'),
  factor('Concrete', 'Site mixed water content 1:2.5:5', 'Water', 'Litres', 24, 'per mix (50kg cement bag basis)', 'document'),
  factor('Concrete', 'Site mixed water content 1:3:6', 'Water', 'Litres', 27, 'per mix (50kg cement bag basis)', 'document'),

  // ---------------- FORMWORK ----------------
  factor('Formwork', 'General formwork (hardwood joinery)', 'Timber (hardwood)', 'CM', 0.0015, 'per SM of formwork'),
  factor('Formwork', 'General formwork', 'Nails', 'Kg', 0.015, 'per SM of formwork'),
  factor('Formwork', 'General formwork', 'Bolts', 'No', 0.162, 'per SM of formwork'),
  factor('Formwork', 'Column/edge formwork (linear)', 'Timber', 'CM', 0.0027, 'per LM'),
  factor('Formwork', 'Column/edge formwork (linear)', 'Gumpoles', 'No', 0.033, 'per LM'),
  factor('Formwork', 'Column/edge formwork (linear)', 'Nails', 'Kg', 0.03, 'per LM'),
  factor('Formwork', 'Edges of concrete 0-75mm high', 'Timber', 'CM', 0.0045, 'per LM'),
  factor('Formwork', 'Edges of concrete 0-75mm high', 'Gumpoles', 'No', 0.033, 'per LM'),
  factor('Formwork', 'Edges of concrete 0-75mm high', 'Nails', 'Kg', 0.06, 'per LM'),
  factor('Formwork', 'Edges of concrete 75-150mm high', 'Timber', 'CM', 0.0062, 'per LM'),
  factor('Formwork', 'Edges of concrete 75-150mm high', 'Gumpoles', 'No', 0.033, 'per LM'),
  factor('Formwork', 'Edges of concrete 75-150mm high', 'Nails', 'Kg', 0.075, 'per LM'),
  factor('Formwork', 'Sides & soffit of slabs (6 uses)', 'Timber', 'CM', 0.0130, 'per SM'),
  factor('Formwork', 'Sides & soffit of slabs (6 uses)', 'Gumpoles', 'CM', 0.0162, 'per SM'),
  factor('Formwork', 'Sides & soffit of slabs (6 uses)', 'Nails', 'Kg', 0.1364, 'per SM'),
  factor('Formwork', 'Sides & soffit of beams / sides of columns (6 uses)', 'Timber', 'CM', 0.0172, 'per SM'),
  factor('Formwork', 'Sides & soffit of beams / sides of columns (6 uses)', 'Gumpoles', 'No', 0.90, 'per SM'),
  factor('Formwork', 'Sides & soffit of beams / sides of columns (6 uses)', 'Nails', 'Kg', 0.1364, 'per SM'),
  factor('Formwork', 'Precast concrete lintel formwork', 'Formwork', 'SM', 18.89, 'per CM of concrete'),
  factor('Formwork', 'Marine ply board 1200x2400mm sheet', 'Marine plyboard', 'No', 0.35, 'per SM of formwork', 'industry-standard'),

  // ---------------- REINFORCEMENT ----------------
  factor('Reinforcement', 'General estimate', 'Reinforcement bars', 'Kg', 100, 'per CM of reinforced concrete (estimating only)'),
  factor('Reinforcement', 'Bar weight 6mm', 'Mild/high-tensile bar', 'Kg/LM', 0.222, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 8mm', 'Mild/high-tensile bar', 'Kg/LM', 0.395, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 10mm', 'Mild/high-tensile bar', 'Kg/LM', 0.617, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 12mm', 'Mild/high-tensile bar', 'Kg/LM', 0.888, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 16mm', 'Mild/high-tensile bar', 'Kg/LM', 1.580, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 20mm', 'Mild/high-tensile bar', 'Kg/LM', 2.470, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 25mm', 'Mild/high-tensile bar', 'Kg/LM', 3.861, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 32mm', 'Mild/high-tensile bar', 'Kg/LM', 6.324, 'per LM of bar'),
  factor('Reinforcement', 'Bar weight 40mm', 'Mild/high-tensile bar', 'Kg/LM', 9.864, 'per LM of bar'),
  factor('Reinforcement', 'Fabric mesh D49', 'Fabric mesh', 'Kg/SM', 0.77, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh A98', 'Fabric mesh', 'Kg/SM', 0.54, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh A142', 'Fabric mesh', 'Kg/SM', 2.22, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh A192', 'Fabric mesh', 'Kg/SM', 3.00, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh A193', 'Fabric mesh', 'Kg/SM', 3.02, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh D196', 'Fabric mesh', 'Kg/SM', 3.05, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh A252', 'Fabric mesh', 'Kg/SM', 3.95, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh B283', 'Fabric mesh', 'Kg/SM', 6.00, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh A393', 'Fabric mesh', 'Kg/SM', 6.16, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh C785', 'Fabric mesh', 'Kg/SM', 6.72, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Fabric mesh B785', 'Fabric mesh', 'Kg/SM', 8.14, 'per SM (roll 45m x 2m)'),
  factor('Reinforcement', 'Binding wire', 'Binding wire (25kg roll)', 'Rolls', 0.001, 'per Kg of reinforcement', 'industry-standard'),

  // ---------------- MORTAR (per CM of mixed mortar) ----------------
  factor('Mortar', 'Mix 1:3', 'Cement', 'Bags', 9.56, 'per CM of mixed mortar'),
  factor('Mortar', 'Mix 1:3', 'Sand', 'Tonnes', 1.6, 'per CM of mixed mortar'),
  factor('Mortar', 'Mix 1:4', 'Cement', 'Bags', 7.66, 'per CM of mixed mortar'),
  factor('Mortar', 'Mix 1:4', 'Sand', 'Tonnes', 1.7, 'per CM of mixed mortar'),
  factor('Mortar', 'Mix 1:5', 'Cement', 'Bags', 6.38, 'per CM of mixed mortar'),
  factor('Mortar', 'Mix 1:5', 'Sand', 'Tonnes', 1.77, 'per CM of mixed mortar'),
  factor('Mortar', 'Mix 1:6', 'Cement', 'Bags', 5.48, 'per CM of mixed mortar'),
  factor('Mortar', 'Mix 1:6', 'Sand', 'Tonnes', 1.82, 'per CM of mixed mortar'),
  factor('Mortar', 'Cement:lime:sand 1:1:3', 'Cement', 'Bags', 7.66, 'per CM of mixed mortar'),
  factor('Mortar', 'Cement:lime:sand 1:1:3', 'Sand', 'Tonnes', 1.28, 'per CM of mixed mortar'),
  factor('Mortar', 'Cement:lime:sand 1:1:3', 'Lime', 'Tonnes', 0.36, 'per CM of mixed mortar'),
  factor('Mortar', 'Cement:lime:sand 1:1:6', 'Cement', 'Bags', 5.00, 'per CM of mixed mortar'),
  factor('Mortar', 'Cement:lime:sand 1:1:6', 'Sand', 'Tonnes', 1.83, 'per CM of mixed mortar'),
  factor('Mortar', 'Cement:lime:sand 1:1:6', 'Lime', 'Tonnes', 0.26, 'per CM of mixed mortar'),
  factor('Mortar', 'Mortar for stone walling 100mm thick', 'Mortar', 'CM', 0.01, 'per SM of walling'),
  factor('Mortar', 'Mortar for stone walling 150mm thick', 'Mortar', 'CM', 0.012, 'per SM of walling'),
  factor('Mortar', 'Mortar for stone walling 200mm thick', 'Mortar', 'CM', 0.018, 'per SM of walling'),
  factor('Mortar', 'Mortar for stone walling 300mm thick', 'Mortar', 'CM', 0.026, 'per SM of walling'),
  factor('Mortar', 'Mortar for block walling 100mm thick', 'Mortar', 'CM', 0.02, 'per SM of walling'),
  factor('Mortar', 'Mortar for block walling 150mm thick', 'Mortar', 'CM', 0.022, 'per SM of walling'),
  factor('Mortar', 'Mortar for block walling 200mm thick', 'Mortar', 'CM', 0.03, 'per SM of walling'),
  factor('Mortar', 'Mortar for block walling 300mm thick', 'Mortar', 'CM', 0.035, 'per SM of walling'),

  // ---------------- WALLING (blocks & stone) ----------------
  factor('Walling', 'Concrete blocks (all thicknesses)', 'Blocks', 'No', 12.5, 'per SM of wall'),
  factor('Walling', 'Machine cut stone 390x190x190mm', 'Stone', 'No', 13.0, 'per SM of wall', 'document'),
  factor('Walling', 'Machine cut stone 390x190x90mm', 'Stone', 'No', 13.0, 'per SM of wall', 'document'),
  factor('Walling', 'Hoop iron 20mm (20kg roll)', 'Hoop iron', 'Rolls', 0.04, 'per SM of wall', 'industry-standard'),

  // ---------------- ROOFING ----------------
  factor('Roofing', 'Mangalore clay tiles 337x237mm', 'Roof tiles', 'No', 19, 'per SM of roof'),
  factor('Roofing', 'Concrete interlocking tiles 375x225mm', 'Roof tiles', 'No', 16.5, 'per SM of roof'),
  factor('Roofing', 'Interlocking tiles 400x325mm', 'Roof tiles', 'No', 10.5, 'per SM of roof'),
  factor('Roofing', 'GCI sheets 2000x600mm', 'Roofing sheets', 'No', 1.1, 'per SM of roof'),
  factor('Roofing', 'GCI sheets 2500x600mm', 'Roofing sheets', 'No', 0.9, 'per SM of roof'),
  factor('Roofing', 'GCI sheets 3000x600mm', 'Roofing sheets', 'No', 0.7, 'per SM of roof'),
  factor('Roofing', 'Roofing sheets (IT5 / box profile) standard', 'Roofing sheets', 'Pieces', 0.32, 'per SM of roof (94mm side laps)', 'document'),
  factor('Roofing', 'Roofing sheets translucent', 'Translucent sheets', 'Pieces', 1.10, 'per SM of roof', 'document'),
  factor('Roofing', 'Ridge cap / valley / hip (1.26m)', 'Ridge caps', 'Pieces', 0.50, 'per LM of ridge/valley/hip', 'document'),
  factor('Roofing', 'Roofing nails', 'Roofing nails', 'Kg', 0.111, 'per SM of roof (1kg covers 9 SM)', 'document'),
  factor('Roofing', 'Timber purlins/members conversion', 'Timber', 'Ft', 3.28, 'per LM (1m = 3.28ft)', 'industry-standard'),
  factor('Roofing', 'Gutters 150mm dia (4m length)', 'Gutters', 'Piece', 0.25, 'per LM of gutter run', 'document'),
  factor('Roofing', 'Downpipes 150mm dia (4m length)', 'Downpipes', 'Piece', 0.25, 'per LM of downpipe run', 'document'),

  // ---------------- FINISHES ----------------
  factor('Finishes', 'Plaster mortar (incl. 15% waste) 12mm', 'Mortar', 'CM', 0.016, 'per SM of plastered surface'),
  factor('Finishes', 'Plaster mortar (incl. 15% waste) 16mm', 'Mortar', 'CM', 0.018, 'per SM of plastered surface'),
  factor('Finishes', 'Plaster mortar (incl. 15% waste) 20mm', 'Mortar', 'CM', 0.021, 'per SM of plastered surface'),
  factor('Finishes', 'Granolithic paving 20mm (incl. 10% waste)', 'Grano mix', 'Kg', 21.56, 'per SM (density 1078 kg/CM)'),
  factor('Finishes', 'Terrazzo/Granolithic component (2:5 mix)', 'Cement', 'Bags', 573, 'per CM (no waste)', 'document'),
  factor('Finishes', 'Glazed ceramic floor tile 100x200x8.5mm', 'Floor tiles', 'No', 50, 'per SM'),
  factor('Finishes', 'Glazed ceramic floor tile 200x200x8.5mm', 'Floor tiles', 'No', 25, 'per SM'),
  factor('Finishes', 'Glazed ceramic floor tile 300x200x8.5mm', 'Floor tiles', 'No', 16, 'per SM'),
  factor('Finishes', 'Glazed ceramic floor tile 300x300x8.5mm', 'Floor tiles', 'No', 11, 'per SM'),
  factor('Finishes', 'Glazed ceramic wall tile 150x150x6mm', 'Wall tiles', 'No', 44, 'per SM'),
  factor('Finishes', 'PVC floor tile 225x225x1.6mm', 'PVC tiles', 'No', 19, 'per SM'),
  factor('Finishes', 'PVC floor tile 250x250x1.6mm', 'PVC tiles', 'No', 16, 'per SM'),
  factor('Finishes', 'PVC floor tile 300x300x2.0mm', 'PVC tiles', 'No', 11, 'per SM'),
  factor('Finishes', 'Floor tile adhesive', 'Adhesive', 'Kg', 1.7, 'per SM'),
  factor('Finishes', 'Cemwash (brushed)', 'Cemwash', 'Kg', 0.0625, 'per SM (1kg covers 16 SM)'),
  factor('Finishes', 'Cemwash (stippled)', 'Cemwash', 'Kg', 0.781, 'per SM (1kg covers 1.28 SM)'),
  factor('Finishes', 'Snowcem (2 coats)', 'Snowcem', 'Kg', 0.667, 'per SM (1kg covers 1.5 SM)'),

  // ---------------- PAINTING (SM per litre per coat -> factor is litres per SM) ----------------
  factor('Painting', 'Emulsion/undercoat paint (avg 13 SM/L)', 'Emulsion paint', 'Litres', 0.077, 'per SM per coat'),
  factor('Painting', 'Gloss enamel paint (avg 13 SM/L)', 'Gloss enamel', 'Litres', 0.077, 'per SM per coat'),
  factor('Painting', 'Primer (red oxide/zinc chromate) (avg 15 SM/L)', 'Primer', 'Litres', 0.067, 'per SM per coat'),
  factor('Painting', 'Bituminous paint (avg 5 SM/L)', 'Bituminous paint', 'Litres', 0.20, 'per SM per coat', 'document'),
  factor('Painting', 'Varnish / polyurethane (avg 4.5 SM/L)', 'Varnish', 'Litres', 0.222, 'per SM per coat'),
  factor('Painting', 'Silicone / Ultraguard paint (avg 10 SM/L)', 'Silicone paint', 'Litres', 0.10, 'per SM per coat', 'industry-standard'),

  // ---------------- SUNDRIES ----------------
  factor('Sundries', 'Antitermite post-construction perimeter treatment', 'Termite chemical', 'Ft', 3.28, 'per LM of wall perimeter', 'document'),
];

export const conversionCategories = Array.from(new Set(defaultConversionFactors.map(f => f.category)));
