import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import AssetDetail from './views/AssetDetail';
import InspectorApp from './views/InspectorApp';
import PublicQR from './views/PublicQR';
import ClientPortfolio from './views/ClientPortfolio';
// 1. Importamos la nueva vista de Login
import Login from './views/Login';

export default function App() {
  // 2. Estado para controlar si el usuario inició sesión (Empieza en falso)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [currentView, setCurrentView] = useState('dashboard');

  const navigateTo = (viewId) => {
    setCurrentView(viewId);
  };

  // 3. Función para "cerrar sesión" (la pasamos al Sidebar)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard'); // Reseteamos la vista para la próxima
  };

  // --- LÓGICA PRINCIPAL ---
  
  // SI NO ESTÁ LOGUEADO, MOSTRAMOS SOLO EL LOGIN
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // SI ESTÁ LOGUEADO, MOSTRAMOS LA APP NORMAL
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* MODO ESCRITORIO (CON SIDEBAR) */}
      {(currentView === 'dashboard' || currentView === 'detail' || currentView === 'clients') && (
        <>
          {/* Le pasamos la función de logout al sidebar */}
          <Sidebar currentView={currentView} onNavigate={navigateTo} onLogout={handleLogout} />
          {currentView === 'dashboard' && <Dashboard onNavigate={navigateTo} />}
          {currentView === 'detail' && <AssetDetail onBack={() => navigateTo('dashboard')} />}
          {currentView === 'clients' && <ClientPortfolio onNavigate={navigateTo} />}
        </>
      )}

      {/* MODOS PANTALLA COMPLETA */}
      {currentView === 'inspector' && (
        <div className="w-full flex justify-center bg-gray-800 py-10">
            <InspectorApp onBack={() => navigateTo('dashboard')} />
        </div>
      )}

      {currentView === 'public' && (
        <div className="w-full">
            <PublicQR />
            <button onClick={() => navigateTo('dashboard')} className="fixed top-4 right-4 bg-white/80 p-2 rounded-full shadow-lg z-50 text-xs font-bold">Salir Demo</button>
        </div>
      )}

    </div>
  );
}