import React from 'react';
import { RotateCcw, Moon, Sun } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { Settings } from '../types';

const numberField = (
  label: string,
  key: keyof Settings,
  suffix: string,
  settings: Settings,
  updateSettings: (patch: Partial<Settings>) => void,
  step = 0.5
) => (
  <div key={key}>
    <label className="label">{label}</label>
    <div className="flex items-center gap-2">
      <input
        className="input"
        type="number"
        step={step}
        value={settings[key] as number}
        onChange={e => updateSettings({ [key]: parseFloat(e.target.value) || 0 } as Partial<Settings>)}
      />
      <span className="text-sm text-blueprint-400 shrink-0">{suffix}</span>
    </div>
  </div>
);

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, toggleDarkMode, resetAllData } = useAppData();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-blueprint-500 dark:text-blueprint-300 mt-1">
          These figures apply across the Grand Summary, Excel export and PDF export for every project.
        </p>
      </div>

      <div className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Currency</label>
            <input className="input" value={settings.currency} onChange={e => updateSettings({ currency: e.target.value })} />
          </div>
          <div>
            <label className="label">Measurement Units</label>
            <select
              className="input"
              value={settings.measurementUnits}
              onChange={e => updateSettings({ measurementUnits: e.target.value as Settings['measurementUnits'] })}
            >
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </div>
          {numberField('Tax (VAT)', 'taxPercent', '%', settings, updateSettings)}
          {numberField('Markup', 'markupPercent', '%', settings, updateSettings)}
          {numberField('Waste Factor', 'wasteFactorPercent', '%', settings, updateSettings)}
          {numberField('Labour Factor', 'labourFactorPercent', '%', settings, updateSettings)}
          {numberField('Regional Rate Adjustment', 'regionalRateAdjustmentPercent', '%', settings, updateSettings)}
        </div>
      </div>

      <div className="card p-6 flex items-center justify-between">
        <div>
          <div className="font-medium text-sm">Appearance</div>
          <div className="text-xs text-blueprint-500 dark:text-blueprint-300 mt-0.5">Switch between light and dark mode.</div>
        </div>
        <button className="btn-secondary" onClick={toggleDarkMode}>
          {settings.darkMode ? <><Sun size={16} /> Switch to Light</> : <><Moon size={16} /> Switch to Dark</>}
        </button>
      </div>

      <div className="card p-6 flex items-center justify-between border-red-200 dark:border-red-900">
        <div>
          <div className="font-medium text-sm text-red-600">Reset All Data</div>
          <div className="text-xs text-blueprint-500 dark:text-blueprint-300 mt-0.5">
            Clears every project, material and conversion factor stored in this browser. This cannot be undone.
          </div>
        </div>
        <button
          className="btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => { if (confirm('Reset all locally stored data?')) resetAllData(); }}
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
