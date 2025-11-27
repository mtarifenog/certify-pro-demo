import React from 'react';
import { LayoutDashboard, Users, FileCheck, Smartphone, QrCode, LogOut } from 'lucide-react';

// 1. Recibimos la nueva prop 'onLogout'
export default function Sidebar({ currentView, onNavigate, onLogout }) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Radar de Negocio', icon: <LayoutDashboard size={20} /> },
    { id: 'clients', label: 'Cartera Clientes', icon: <Users size={20} /> },
    { id: 'inspector', label: 'Demo App Inspector', icon: <Smartphone size={20} /> },
    { id: 'public', label: 'Demo QR Público', icon: <QrCode size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">C</div>
        <span className="text-xl font-bold tracking-tight">CertifyPro</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-400 mb-1">Saldo Disponible</p>
          <p className="text-2xl font-bold text-white">14 <span className="text-sm font-normal text-slate-400">créditos</span></p>
        </div>
        {/* 2. Conectamos el botón con la función onLogout */}
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm px-2 w-full transition-colors">
            <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}