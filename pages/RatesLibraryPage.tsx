import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, Search, TrendingUp } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { formatCurrency } from '../utils/calculations';

const RatesLibraryPage: React.FC = () => {
  const { materials, updateMaterial, addMaterial, settings } = useAppData();
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = materials.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));

  const handleFile = (file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let updated = 0, created = 0;
        for (const raw of results.data) {
          const keys = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k.trim().toLowerCase(), v]));
          const name = keys['name'] || keys['material'];
          const rate = parseFloat(keys['rate'] || keys['default rate'] || '');
          if (!name || !Number.isFinite(rate)) continue;
          const existing = materials.find(m => m.name.toLowerCase() === name.toLowerCase());
          if (existing) {
            updateMaterial(existing.id, { defaultRate: rate, supplier: keys['supplier'] || existing.supplier });
            updated++;
          } else {
            addMaterial({ name, unit: keys['unit'] || 'No', defaultRate: rate, supplier: keys['supplier'] || '', remarks: '', category: keys['category'] || 'Imported' });
            created++;
          }
        }
        setMessage(`Imported rates: ${updated} updated, ${created} new materials added.`);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Rates Library</h1>
          <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1 max-w-2xl">
            Rates seeded from the uploaded schedule's historical prices where available — every figure stays editable, and you can re-import
            current market rates from Excel or CSV at any time.
          </p>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <button className="btn-primary" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> Import CSV
          </button>
        </div>
      </div>

      {message && (
        <div className="card p-3 text-sm bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <TrendingUp size={15} /> {message}
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blueprint-400" />
        <input className="input pl-9" placeholder="Search materials..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-blueprint-800 text-white text-xs uppercase tracking-wide">
              <th className="px-3 py-2.5 text-left">Material</th>
              <th className="px-3 py-2.5 text-left w-24">Unit</th>
              <th className="px-3 py-2.5 text-right w-40">Rate ({settings.currency})</th>
              <th className="px-3 py-2.5 text-left w-40">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} className={`border-b border-blueprint-50 dark:border-graphite-800 ${i % 2 ? 'bg-blueprint-50/40 dark:bg-graphite-800/20' : ''}`}>
                <td className="px-3 py-1.5 font-medium">{m.name}</td>
                <td className="px-3 py-1.5 text-blueprint-500 dark:text-blueprint-300">{m.unit}</td>
                <td className="px-3 py-1">
                  <input
                    className="table-cell-input text-right font-mono"
                    type="number"
                    value={m.defaultRate}
                    onChange={e => updateMaterial(m.id, { defaultRate: parseFloat(e.target.value) || 0 })}
                  />
                </td>
                <td className="px-3 py-1"><input className="table-cell-input" value={m.supplier ?? ''} onChange={e => updateMaterial(m.id, { supplier: e.target.value })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-blueprint-400">
        Example row shown as {formatCurrency(materials[0]?.defaultRate ?? 0, settings.currency)} — CSV columns recognised: name, unit, rate, supplier, category.
      </p>
    </div>
  );
};

export default RatesLibraryPage;
