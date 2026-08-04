import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { parseCsvToRows, parseExcelToRows } from '../utils/importUtils';
import { ScheduleRow } from '../types';

const ImportBoqPage: React.FC = () => {
  const { currentProject, createProject, addWorksheet } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ScheduleRow[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    try {
      const rows = file.name.toLowerCase().endsWith('.csv')
        ? await parseCsvToRows(file)
        : await parseExcelToRows(file);
      setPreview(rows);
    } catch (e) {
      setError('Could not read that file. Please upload a .csv or .xlsx file with Ref, Description, Unit, Input Qty, Factor and Rate columns.');
    }
  };

  const confirmImport = () => {
    if (!preview) return;
    if (!currentProject) createProject();
    addWorksheet(fileName.replace(/\.(csv|xlsx?)$/i, '') || 'Imported BOQ', 'Imported', preview);
    navigate('/project/info');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Import BOQ</h1>
        <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1">
          Upload a Bill of Quantities as Excel or CSV. Expected columns: <code>Ref, Description, Unit, Input Qty, Factor, Rate</code>.
        </p>
      </div>

      <div
        className="card p-10 text-center border-dashed border-2 cursor-pointer hover:border-amber-400"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
      >
        <Upload size={28} className="mx-auto text-blueprint-400 mb-3" />
        <div className="font-medium text-sm">Drop a .xlsx or .csv file here, or click to browse</div>
        <div className="text-xs text-blueprint-400 mt-1">Your data stays in this browser — nothing is uploaded to a server.</div>
        <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {error && <div className="card p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">{error}</div>}

      {preview && (
        <div className="card overflow-x-auto">
          <div className="px-4 py-3 border-b border-blueprint-100 dark:border-graphite-800 font-medium text-sm flex items-center gap-2">
            <FileSpreadsheet size={16} /> {fileName} — {preview.length} rows detected
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-blueprint-400 border-b border-blueprint-100 dark:border-graphite-800">
                <th className="px-3 py-2 text-left">Ref</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Unit</th>
                <th className="px-3 py-2 text-right">Input Qty</th>
                <th className="px-3 py-2 text-right">Factor</th>
                <th className="px-3 py-2 text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              {preview.slice(0, 10).map(r => (
                <tr key={r.id} className="border-b border-blueprint-50 dark:border-graphite-800">
                  <td className="px-3 py-1.5">{r.ref}</td>
                  <td className="px-3 py-1.5">{r.description}</td>
                  <td className="px-3 py-1.5">{r.unit}</td>
                  <td className="px-3 py-1.5 text-right">{r.inputQty ?? ''}</td>
                  <td className="px-3 py-1.5 text-right">{r.factor ?? ''}</td>
                  <td className="px-3 py-1.5 text-right">{r.rate ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview.length > 10 && <div className="px-4 py-2 text-xs text-blueprint-400">+ {preview.length - 10} more rows</div>}
          <div className="p-4 border-t border-blueprint-100 dark:border-graphite-800">
            <button className="btn-primary" onClick={confirmImport}>
              Create Worksheet from Import <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportBoqPage;
