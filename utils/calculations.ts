import { ScheduleRow, Worksheet, MaterialItem, Settings } from '../types';

/** Quantity = Input Qty x Conversion Factor. Amount = Quantity x Rate. */
export function computeRow(row: ScheduleRow): ScheduleRow {
  if (row.subheading) {
    return { ...row, qty: null, amount: null };
  }
  const inputQty = row.inputQty ?? 0;
  const factor = row.factor ?? 0;
  const rate = row.rate ?? 0;
  const qty = round2(inputQty * factor);
  const amount = round2(qty * rate);
  return { ...row, qty, amount };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function worksheetTotal(ws: Worksheet): number {
  return round2(ws.rows.reduce((sum, r) => sum + (r.amount || 0), 0));
}

export function projectGrandTotal(worksheets: Worksheet[]): number {
  return round2(worksheets.reduce((sum, ws) => sum + worksheetTotal(ws), 0));
}

export interface SummaryLine {
  materialId: string;
  name: string;
  unit: string;
  totalQty: number;
  totalAmount: number;
}

/** Combine identical materials (by materialId) across every worksheet into one summary. */
export function buildMaterialSummary(worksheets: Worksheet[], materials: MaterialItem[]): SummaryLine[] {
  const map = new Map<string, SummaryLine>();
  for (const ws of worksheets) {
    for (const row of ws.rows) {
      if (row.subheading || !row.materialId || !row.qty) continue;
      const mat = materials.find(m => m.id === row.materialId);
      const name = mat?.name || row.description;
      const unit = mat?.unit || row.unit;
      const key = row.materialId;
      const existing = map.get(key);
      if (existing) {
        existing.totalQty = round2(existing.totalQty + (row.qty || 0));
        existing.totalAmount = round2(existing.totalAmount + (row.amount || 0));
      } else {
        map.set(key, {
          materialId: key,
          name,
          unit,
          totalQty: row.qty || 0,
          totalAmount: row.amount || 0
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function applySettingsToGrandTotal(grandTotal: number, settings: Settings) {
  const waste = grandTotal * (settings.wasteFactorPercent / 100);
  const labour = grandTotal * (settings.labourFactorPercent / 100);
  const markup = (grandTotal + waste + labour) * (settings.markupPercent / 100);
  const subtotal = grandTotal + waste + labour + markup;
  const tax = subtotal * (settings.taxPercent / 100);
  const finalTotal = subtotal + tax;
  return { grandTotal, waste, labour, markup, subtotal, tax, finalTotal };
}

export function formatCurrency(value: number, currency = 'KES'): string {
  return `${currency} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
