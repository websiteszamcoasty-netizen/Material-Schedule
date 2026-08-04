import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Search, BookOpen, Wrench } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { conversionCategories } from '../data/conversionFactors';

const sourceBadge: Record<string, string> = {
  document: 'bg-blueprint-100 text-blueprint-700 dark:bg-blueprint-800 dark:text-blueprint-100',
  'industry-standard': 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  custom: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
};

const ConversionFactorsPage: React.FC = () => {
  const { conversionFactors, addConversionFactor, updateConversionFactor, removeConversionFactor } = useAppData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    return conversionFactors.filter(cf => {
      const matchesCategory = category === 'All' || cf.category === category;
      const q = query.toLowerCase();
      const matchesQuery = !q ||
        cf.material.toLowerCase().includes(q) ||
        cf.subcategory.toLowerCase().includes(q) ||
        cf.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [conversionFactors, query, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Conversion Factors</h1>
          <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1 max-w-2xl">
            Loaded from the <em>Conversion Factors for Preparing a Schedule of Materials</em> reference document.
            Where the document didn't specify a figure, an accepted industry-standard default is used instead — everything below is editable.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => addConversionFactor({
            category: 'Custom', subcategory: 'New subcategory', material: 'New material',
            unit: 'No', factor: 1, basis: 'per unit', source: 'custom', editable: true
          })}
        >
          <Plus size={16} /> Add Factor
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative max-w-xs flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blueprint-400" />
          <input className="input pl-9" placeholder="Search factors..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="input max-w-[220px]" value={category} onChange={e => setCategory(e.target.value)}>
          <option>All</option>
          {conversionCategories.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-3 text-xs ml-auto">
          <span className={`px-2 py-1 rounded-full flex items-center gap-1 ${sourceBadge.document}`}><BookOpen size={12} /> From document</span>
          <span className={`px-2 py-1 rounded-full flex items-center gap-1 ${sourceBadge['industry-standard']}`}><Wrench size={12} /> Industry standard</span>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="bg-blueprint-800 text-white text-xs uppercase tracking-wide">
              <th className="px-3 py-2.5 text-left w-32">Category</th>
              <th className="px-3 py-2.5 text-left min-w-[200px]">Subcategory</th>
              <th className="px-3 py-2.5 text-left w-40">Material</th>
              <th className="px-3 py-2.5 text-left w-20">Unit</th>
              <th className="px-3 py-2.5 text-right w-24">Factor</th>
              <th className="px-3 py-2.5 text-left min-w-[180px]">Basis</th>
              <th className="px-3 py-2.5 text-left w-32">Source</th>
              <th className="px-3 py-2.5 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cf, i) => (
              <tr key={cf.id} className={`border-b border-blueprint-50 dark:border-graphite-800 ${i % 2 ? 'bg-blueprint-50/40 dark:bg-graphite-800/20' : ''}`}>
                <td className="px-3 py-1"><input className="table-cell-input" value={cf.category} onChange={e => updateConversionFactor(cf.id, { category: e.target.value })} /></td>
                <td className="px-3 py-1"><input className="table-cell-input" value={cf.subcategory} onChange={e => updateConversionFactor(cf.id, { subcategory: e.target.value })} /></td>
                <td className="px-3 py-1"><input className="table-cell-input" value={cf.material} onChange={e => updateConversionFactor(cf.id, { material: e.target.value })} /></td>
                <td className="px-3 py-1"><input className="table-cell-input" value={cf.unit} onChange={e => updateConversionFactor(cf.id, { unit: e.target.value })} /></td>
                <td className="px-3 py-1">
                  <input
                    className="table-cell-input text-right font-mono"
                    type="number"
                    step="any"
                    value={cf.factor}
                    onChange={e => updateConversionFactor(cf.id, { factor: parseFloat(e.target.value) || 0 })}
                  />
                </td>
                <td className="px-3 py-1"><input className="table-cell-input text-xs" value={cf.basis} onChange={e => updateConversionFactor(cf.id, { basis: e.target.value })} /></td>
                <td className="px-3 py-1">
                  <span className={`text-[10px] px-2 py-1 rounded-full ${sourceBadge[cf.source]}`}>
                    {cf.source === 'document' ? 'Document' : cf.source === 'industry-standard' ? 'Industry standard' : 'Custom'}
                  </span>
                </td>
                <td className="px-3 py-1 text-right">
                  <button className="p-1 text-red-400 hover:text-red-600" onClick={() => removeConversionFactor(cf.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-blueprint-400 text-sm">No factors match your search.</div>}
      </div>
    </div>
  );
};

export default ConversionFactorsPage;
