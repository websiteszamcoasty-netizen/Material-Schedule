import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { ScheduleRow } from '../types';
import { uid } from './id';
import { computeRow } from './calculations';

export interface ImportedRow {
  ref: string;
  description: string;
  unit: string;
  inputQty: number | null;
  factor: number | null;
  rate: number | null;
}

function toRow(r: ImportedRow): ScheduleRow {
  return computeRow({
    id: uid('row'),
    ref: r.ref || '',
    description: r.description || '',
    unit: r.unit || '',
    inputQty: r.inputQty,
    factor: r.factor,
    qty: null,
    rate: r.rate,
    amount: null,
    remarks: ''
  });
}

function pick(row: Record<string, string>, keys: string[]): string {
  for (const k of Object.keys(row)) {
    if (keys.includes(k.trim().toLowerCase())) return row[k];
  }
  return '';
}

function numOrNull(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function parseCsvToRows(file: File): Promise<ScheduleRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map(raw => toRow({
          ref: pick(raw, ['ref', 'reference']),
          description: pick(raw, ['description', 'desc', 'item']),
          unit: pick(raw, ['unit']),
          inputQty: numOrNull(pick(raw, ['input qty', 'inputqty', 'qty', 'quantity'])),
          factor: numOrNull(pick(raw, ['factor', 'fctr', 'conversion factor'])),
          rate: numOrNull(pick(raw, ['rate']))
        }));
        resolve(rows);
      },
      error: reject
    });
  });
}

export async function parseExcelToRows(file: File): Promise<ScheduleRow[]> {
  const wb = new ExcelJS.Workbook();
  const buf = await file.arrayBuffer();
  await wb.xlsx.load(buf);
  const sheet = wb.worksheets[0];
  const rows: ScheduleRow[] = [];
  const headerMap: Record<number, string> = {};
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell((cell, colNumber) => {
        headerMap[colNumber] = String(cell.value ?? '').trim().toLowerCase();
      });
      return;
    }
    const obj: Record<string, string> = {};
    row.eachCell((cell, colNumber) => {
      obj[headerMap[colNumber] || `col${colNumber}`] = String(cell.value ?? '');
    });
    if (!obj['description'] && !obj['ref']) return;
    rows.push(toRow({
      ref: obj['ref'] || obj['reference'] || '',
      description: obj['description'] || obj['item'] || '',
      unit: obj['unit'] || '',
      inputQty: numOrNull(obj['input qty'] || obj['qty'] || obj['quantity'] || ''),
      factor: numOrNull(obj['factor'] || obj['fctr'] || ''),
      rate: numOrNull(obj['rate'] || '')
    }));
  });
  return rows;
}
