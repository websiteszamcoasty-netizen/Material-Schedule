import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { worksheetTotal, formatCurrency } from '../utils/calculations';
import { ScheduleRow } from '../types';

const WorksheetPage: React.FC = () => {
  const { worksheetId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject, updateWorksheetRow, addWorksheetRow, removeWorksheetRow, reorderWorksheetRow
  } = useAppData();

  const worksheet = currentProject?.worksheets.find(w => w.id === worksheetId);
  const idx = currentProject?.worksheets.findIndex(w => w.id === worksheetId) ?? -1;
  const prevWs = currentProject && idx > 0 ? currentProject.worksheets[idx - 1] : null;
  const nextWs = currentProject && idx >= 0 && idx < currentProject.worksheets.length - 1 ? currentProject.worksheets[idx + 1] : null;

  const total = useMemo(() => (worksheet ? worksheetTotal(worksheet) : 0), [worksheet]);

  if (!currentProject) {
    return <div className="card p-8 text-center text-blueprint-500">No active project. Go to the Dashboard to create or open one.</div>;
  }
  if (!worksheet) {
    return <div className="card p-8 text-center text-blueprint-500">Worksheet not found.</div>;
  }

  const handleChange = (row: ScheduleRow, patch: Partial<ScheduleRow>) => {
    updateWorksheetRow(worksheet.id, row.id, patch);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs text-blueprint-500 dark:text-blueprint-300 flex items-center gap-1.5">
            <FileSpreadsheet size={13} /> {worksheet.group}
          </div>
          <h1 className="font-display text-2xl font-semibold">{worksheet.title}</h1>
          <p className="text-xs text-blueprint-400 mt-0.5">
            {currentProject.info.projectName} · Ref {currentProject.info.boqReference || '—'} · {currentProject.info.date}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {prevWs && (
            <button className="btn-secondary" onClick={() => navigate(`/worksheet/${prevWs.id}`)}>
              <ChevronLeft size={16} /> {prevWs.title}
            </button>
          )}
          {nextWs && (
            <button className="btn-secondary" onClick={() => navigate(`/worksheet/${nextWs.id}`)}>
              {nextWs.title} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="bg-blueprint-800 text-white text-xs uppercase tracking-wide">
              <th className="px-2 py-2.5 w-12 text-left">Ref</th>
              <th className="px-2 py-2.5 text-left min-w-[260px]">Description</th>
              <th className="px-2 py-2.5 w-20 text-left">Unit</th>
              <th className="px-2 py-2.5 w-24 text-right bg-amber-500/90 text-blueprint-950">Input Qty</th>
              <th className="px-2 py-2.5 w-20 text-right bg-amber-500/90 text-blueprint-950">Fctr</th>
              <th className="px-2 py-2.5 w-24 text-right">Qty</th>
              <th className="px-2 py-2.5 w-28 text-right">Rate</th>
              <th className="px-2 py-2.5 w-32 text-right">Amount</th>
              <th className="px-2 py-2.5 w-36 text-left">Remarks</th>
              <th className="px-1 py-2.5 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {worksheet.rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-blueprint-50 dark:border-graphite-800 ${
                  row.subheading ? 'bg-blueprint-50 dark:bg-graphite-800/60 italic font-semibold' : i % 2 === 0 ? '' : 'bg-blueprint-50/40 dark:bg-graphite-800/20'
                }`}
              >
                <td className="px-2 py-1">
                  <input className="table-cell-input font-medium" value={row.ref} onChange={e => handleChange(row, { ref: e.target.value })} />
                </td>
                <td className="px-2 py-1">
                  <input className="table-cell-input" value={row.description} onChange={e => handleChange(row, { description: e.target.value })} />
                </td>
                {row.subheading ? (
                  <td colSpan={7}></td>
                ) : (
                  <>
                    <td className="px-2 py-1">
                      <input className="table-cell-input" value={row.unit} onChange={e => handleChange(row, { unit: e.target.value })} />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="table-cell-input text-right"
                        type="number"
                        value={row.inputQty ?? ''}
                        onChange={e => handleChange(row, { inputQty: e.target.value === '' ? null : parseFloat(e.target.value) })}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="table-cell-input text-right"
                        type="number"
                        step="any"
                        value={row.factor ?? ''}
                        onChange={e => handleChange(row, { factor: e.target.value === '' ? null : parseFloat(e.target.value) })}
                      />
                    </td>
                    <td className="px-2 py-1 text-right font-mono text-blueprint-700 dark:text-blueprint-200">
                      {row.qty ?? ''}
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="table-cell-input text-right"
                        type="number"
                        value={row.rate ?? ''}
                        onChange={e => handleChange(row, { rate: e.target.value === '' ? null : parseFloat(e.target.value) })}
                      />
                    </td>
                    <td className="px-2 py-1 text-right font-mono font-medium">
                      {row.amount != null ? row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                    </td>
                    <td className="px-2 py-1">
                      <input className="table-cell-input" value={row.remarks ?? ''} onChange={e => handleChange(row, { remarks: e.target.value })} />
                    </td>
                  </>
                )}
                <td className="px-1 py-1">
                  <div className="flex items-center gap-0.5 justify-end">
                    <button className="p-1 text-blueprint-400 hover:text-blueprint-700 dark:hover:text-amber-400" onClick={() => reorderWorksheetRow(worksheet.id, row.id, 'up')}><ArrowUp size={14} /></button>
                    <button className="p-1 text-blueprint-400 hover:text-blueprint-700 dark:hover:text-amber-400" onClick={() => reorderWorksheetRow(worksheet.id, row.id, 'down')}><ArrowDown size={14} /></button>
                    <button className="p-1 text-red-400 hover:text-red-600" onClick={() => removeWorksheetRow(worksheet.id, row.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blueprint-800 text-white font-semibold">
              <td colSpan={7} className="px-2 py-3 text-right">Carried to collection — {worksheet.title} Main Summary</td>
              <td className="px-2 py-3 text-right font-mono text-amber-400">{formatCurrency(total, currentProject.info.currency)}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => addWorksheetRow(worksheet.id)}>
          <Plus size={16} /> Add Row
        </button>
        <Link to="/materials" className="btn-ghost text-xs self-center">
          Manage material links &amp; rates in the Material Library →
        </Link>
      </div>
    </div>
  );
};

export default WorksheetPage;
