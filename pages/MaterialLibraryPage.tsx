import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { formatCurrency } from '../utils/calculations';

const MaterialLibraryPage: React.FC = () => {
  const { materials, addMaterial, updateMaterial, removeMaterial, settings } = useAppData();
  const [query, setQuery] = useState('');

  const filtered = materials.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    (m.category || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Material Library</h1>
          <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1">
            The editable database of materials, units, default rates and suppliers used across every worksheet.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => addMaterial({ name: 'New Material', unit: 'No', defaultRate: 0, supplier: '', remarks: '', category: 'General' })}
        >
          <Plus size={16} /> Add Material
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blueprint-400" />
        <input className="input pl-9" placeholder="Search materials..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-blueprint-800 text-white text-xs uppercase tracking-wide">
              <th className="px-3 py-2.5 text-left">Name</th>
              <th className="px-3 py-2.5 text-left w-24">Unit</th>
              <th className="px-3 py-2.5 text-right w-32">Default Rate</th>
              <th className="px-3 py-2.5 text-left w-36">Category</th>
              <th className="px-3 py-2.5 text-left w-36">Supplier</th>
              <th className="px-3 py-2.5 text-left w-48">Remarks</th>
              <th className="px-3 py-2.5 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} className={`border-b border-blueprint-50 dark:border-graphite-800 ${i % 2 ? 'bg-blueprint-50/40 dark:bg-graphite-800/20' : ''}`}>
                <td className="px-3 py-1"><input className="table-cell-input font-medium" value={m.name} onChange={e => updateMaterial(m.id, { name: e.target.value })} /></td>
                <td className="px-3 py-1"><input className="table-cell-input" value={m.unit} onChange={e => updateMaterial(m.id, { unit: e.target.value })} /></td>
                <td className="px-3 py-1">
                  <input
                    className="table-cell-input text-right"
                    type="number"
                    value={m.defaultRate}
                    onChange={e => updateMaterial(m.id, { defaultRate: parseFloat(e.target.value) || 0 })}
                  />
                </td>
                <td className="px-3 py-1"><input className="table-cell-input" value={m.category ?? ''} onChange={e => updateMaterial(m.id, { category: e.target.value })} /></td>
                <td className="px-3 py-1"><input className="table-cell-input" value={m.supplier ?? ''} onChange={e => updateMaterial(m.id, { supplier: e.target.value })} /></td>
                <td className="px-3 py-1"><input className="table-cell-input" value={m.remarks ?? ''} onChange={e => updateMaterial(m.id, { remarks: e.target.value })} /></td>
                <td className="px-3 py-1 text-right">
                  <button className="p-1 text-red-400 hover:text-red-600" onClick={() => removeMaterial(m.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-blueprint-400 text-sm">No materials match your search.</div>}
      </div>
      <p className="text-xs text-blueprint-400">
        Rates shown as {formatCurrency(0, settings.currency).split(' ')[0]} — change your default currency in Settings.
      </p>
    </div>
  );
};

export default MaterialLibraryPage;
