import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { InstancesView } from './views/InstancesView';
import { SQLAnalysisView } from './views/SQLAnalysisView';
import { MetricsView } from './views/MetricsView';
import { AlertsView } from './views/AlertsView';
import { CapacityView } from './views/CapacityView';
import { View } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'instances': return <InstancesView />;
      case 'sql': return <SQLAnalysisView />;
      case 'capacity': return <CapacityView />;
      case 'metrics': return <MetricsView />;
      case 'alerts': return <AlertsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 tech-grid opacity-[0.15] pointer-events-none"></div>
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isDark={isDark} 
        onToggleTheme={() => setIsDark(!isDark)} 
      />
      
      <main className="flex-1 p-10 max-w-[1600px] mx-auto relative z-10">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
