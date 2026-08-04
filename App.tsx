import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ProjectInfoPage from './pages/ProjectInfoPage';
import ProjectsPage from './pages/ProjectsPage';
import WorksheetPage from './pages/WorksheetPage';
import MaterialLibraryPage from './pages/MaterialLibraryPage';
import ConversionFactorsPage from './pages/ConversionFactorsPage';
import RatesLibraryPage from './pages/RatesLibraryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ImportBoqPage from './pages/ImportBoqPage';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppDataProvider>
      <HashRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/info" element={<ProjectInfoPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/worksheet/:worksheetId" element={<WorksheetPage />} />
            <Route path="/materials" element={<MaterialLibraryPage />} />
            <Route path="/conversion-factors" element={<ConversionFactorsPage />} />
            <Route path="/rates" element={<RatesLibraryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/import" element={<ImportBoqPage />} />
          </Routes>
        </Shell>
      </HashRouter>
    </AppDataProvider>
  );
};

export default App;
