import React, { useMemo, useState } from 'react';
import { FileSpreadsheet, FileText, Printer, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAppData } from '../context/AppDataContext';
import { worksheetTotal, projectGrandTotal, buildMaterialSummary, applySettingsToGrandTotal, formatCurrency } from '../utils/calculations';
import { exportProjectToExcel } from '../utils/excelExport';
import { exportProjectToPdf } from '../utils/pdfExport';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const palette = ['#183c5c', '#2f6795', '#4d84b0', '#7fa9cb', '#f2b134', '#e8a020', '#adc9df', '#122c44'];

const ReportsPage: React.FC = () => {
  const { currentProject, materials, settings } = useAppData();
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

  const summary = useMemo(
    () => (currentProject ? buildMaterialSummary(currentProject.worksheets, materials) : []),
    [currentProject, materials]
  );

  if (!currentProject) {
    return <div className="card p-8 text-center text-blueprint-500">No active project. Create or open a project to view reports.</div>;
  }

  const grandTotal = projectGrandTotal(currentProject.worksheets);
  const adj = applySettingsToGrandTotal(grandTotal, settings);

  const elementChart = {
    labels: currentProject.worksheets.map(w => w.title),
    datasets: [{
      data: currentProject.worksheets.map(w => worksheetTotal(w)),
      backgroundColor: currentProject.worksheets.map((_, i) => palette[i % palette.length])
    }]
  };

  const topMaterials = [...summary].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 8);
  const materialChart = {
    labels: topMaterials.map(m => m.name),
    datasets: [{ label: 'Amount', data: topMaterials.map(m => m.totalAmount), backgroundColor: '#2f6795' }]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1">{currentProject.info.projectName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Preview
          </button>
          <button
            className="btn-secondary"
            disabled={exporting === 'pdf'}
            onClick={async () => { setExporting('pdf'); try { exportProjectToPdf(currentProject, materials, settings); } finally { setExporting(null); } }}
          >
            <FileText size={16} /> Export PDF
          </button>
          <button
            className="btn-primary"
            disabled={exporting === 'excel'}
            onClick={async () => { setExporting('excel'); try { await exportProjectToExcel(currentProject, materials, settings); } finally { setExporting(null); } }}
          >
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Elements', value: currentProject.worksheets.length.toString() },
          { label: 'Subtotal', value: formatCurrency(adj.grandTotal, settings.currency) },
          { label: 'Tax + Markup', value: formatCurrency(adj.tax + adj.markup, settings.currency) },
          { label: 'Grand Total', value: formatCurrency(adj.finalTotal, settings.currency), highlight: true },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.highlight ? 'bg-blueprint-800 text-white border-none' : ''}`}>
            <div className={`text-xs uppercase tracking-wide ${s.highlight ? 'text-amber-400' : 'text-blueprint-400'}`}>{s.label}</div>
            <div className={`text-lg font-semibold mt-1 font-mono ${s.highlight ? '' : ''}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium"><PieIcon size={16} /> Cost by Element</div>
          <div className="max-w-xs mx-auto"><Pie data={elementChart} /></div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium"><BarChart3 size={16} /> Top Materials by Cost</div>
          <Bar data={materialChart} options={{ indexAxis: 'y', plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <div className="px-4 py-3 border-b border-blueprint-100 dark:border-graphite-800 font-medium text-sm">Grand Summary</div>
        <table className="w-full text-sm">
          <tbody>
            {currentProject.worksheets.map((ws, i) => (
              <tr key={ws.id} className={`border-b border-blueprint-50 dark:border-graphite-800 ${i % 2 ? 'bg-blueprint-50/40 dark:bg-graphite-800/20' : ''}`}>
                <td className="px-4 py-2">{ws.title}</td>
                <td className="px-4 py-2 text-right font-mono">{formatCurrency(worksheetTotal(ws), settings.currency)}</td>
              </tr>
            ))}
            <tr><td className="px-4 py-2">Subtotal (Elements)</td><td className="px-4 py-2 text-right font-mono">{formatCurrency(adj.grandTotal, settings.currency)}</td></tr>
            <tr><td className="px-4 py-2">Waste Factor ({settings.wasteFactorPercent}%)</td><td className="px-4 py-2 text-right font-mono">{formatCurrency(adj.waste, settings.currency)}</td></tr>
            <tr><td className="px-4 py-2">Labour Factor ({settings.labourFactorPercent}%)</td><td className="px-4 py-2 text-right font-mono">{formatCurrency(adj.labour, settings.currency)}</td></tr>
            <tr><td className="px-4 py-2">Markup ({settings.markupPercent}%)</td><td className="px-4 py-2 text-right font-mono">{formatCurrency(adj.markup, settings.currency)}</td></tr>
            <tr><td className="px-4 py-2">Tax ({settings.taxPercent}%)</td><td className="px-4 py-2 text-right font-mono">{formatCurrency(adj.tax, settings.currency)}</td></tr>
            <tr className="bg-amber-50 dark:bg-amber-500/10 font-semibold"><td className="px-4 py-2.5">GRAND TOTAL</td><td className="px-4 py-2.5 text-right font-mono">{formatCurrency(adj.finalTotal, settings.currency)}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card overflow-x-auto">
        <div className="px-4 py-3 border-b border-blueprint-100 dark:border-graphite-800 font-medium text-sm">Material Summary — combined across all worksheets</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-blueprint-400 border-b border-blueprint-100 dark:border-graphite-800">
              <th className="px-4 py-2 text-left">Material</th>
              <th className="px-4 py-2 text-left">Unit</th>
              <th className="px-4 py-2 text-right">Total Quantity</th>
              <th className="px-4 py-2 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s, i) => (
              <tr key={s.materialId} className={`border-b border-blueprint-50 dark:border-graphite-800 ${i % 2 ? 'bg-blueprint-50/40 dark:bg-graphite-800/20' : ''}`}>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2 text-blueprint-500 dark:text-blueprint-300">{s.unit}</td>
                <td className="px-4 py-2 text-right font-mono">{s.totalQty.toLocaleString()}</td>
                <td className="px-4 py-2 text-right font-mono">{formatCurrency(s.totalAmount, settings.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {summary.length === 0 && <div className="p-8 text-center text-blueprint-400 text-sm">No quantities entered yet — fill in worksheet input quantities to see the material summary.</div>}
      </div>
    </div>
  );
};

export default ReportsPage;
