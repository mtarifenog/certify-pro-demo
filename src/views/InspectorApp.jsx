import React, { useState } from 'react';
import { QrCode, CheckCircle2, XCircle, Camera, ChevronLeft, UploadCloud, MapPin } from 'lucide-react';

export default function InspectorApp({ onBack }) {
  const [activeTab, setActiveTab] = useState('checklist'); 

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-900 pb-24 max-w-md mx-auto shadow-2xl border-x border-gray-200 relative">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-300 hover:text-white transition-colors"><ChevronLeft /></button>
          <h1 className="font-bold text-lg">Inspección #4092</h1>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-slate-800">JM</div>
        </div>
        
        {/* TARJETA DEL ACTIVO */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Ascensor</span>
                <span className="text-slate-400 text-xs flex items-center gap-1"><MapPin size={10} /> Torre A - Piso 1</span>
              </div>
              <h2 className="text-xl font-bold text-white">Schindler 3300</h2>
            </div>
            <div className="bg-white p-1.5 rounded-lg shadow-sm"><QrCode className="text-slate-900" size={22} /></div>
          </div>
        </div>
      </header>

      {/* CONTENIDO SCROLLEABLE */}
      <main className="p-4">
        {/* TABS */}
        <div className="flex p-1 bg-gray-200/50 rounded-lg mb-6">
          <button onClick={() => setActiveTab('checklist')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'checklist' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Checklist</button>
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'info' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Bitácora</button>
        </div>

        {/* CHECKLIST */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2ml-1">Seguridad Crítica</h3>
          <CheckItem title="Nivelación de Parada" desc="Max +/- 10mm" />
          <CheckItem title="Cables de Tracción" desc="Sin hilos cortados" isError />
          <CheckItem title="Iluminación Emergencia" desc="Luxometría > 50 lux" />
        </div>

        {/* EVIDENCIA (FOTO CORREGIDA) */}
        <div className="mt-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Evidencia Fotográfica</h3>
            <div className="grid grid-cols-2 gap-3">
                {/* Botón Cámara */}
                <button className="border-2 border-dashed border-gray-300 rounded-xl h-28 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-500 transition-all active:scale-95">
                  <Camera size={24} className="mb-1" />
                  <span className="text-[10px] font-bold">AGREGAR FOTO</span>
                </button>
                
                {/* FOTO TÉCNICA (CORREGIDA) */}
                <div className="relative rounded-xl h-28 bg-gray-900 overflow-hidden border border-gray-200 shadow-sm group">
                    <img 
                      src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=300&auto=format&fit=crop" // <-- FOTO DE SALA DE MÁQUINAS
                      alt="Evidencia Sala de Máquinas" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      <div className="bg-green-500 text-white p-1 rounded-full">
                        <CheckCircle2 size={18} />
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      
      {/* BARRA INFERIOR (BOTÓN AJUSTADO) */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
          <UploadCloud size={18} /> Finalizar Inspección
        </button>
      </div>
    </div>
  );
}

// Componente de Item de Checklist (Sin cambios mayores)
function CheckItem({ title, desc, isError }) {
  return (
    <div className={`bg-white p-3.5 rounded-xl border shadow-sm flex justify-between items-center ${isError ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
      <div>
        <h4 className={`font-bold text-sm ${isError ? 'text-red-700' : 'text-gray-900'}`}>{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <div className="flex gap-2">
        <button className={`p-1.5 rounded-lg transition-colors ${isError ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-300 hover:bg-red-100 hover:text-red-500'}`}>
          <XCircle size={20} />
        </button>
        <button className={`p-1.5 rounded-lg transition-colors ${!isError ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300 hover:bg-green-100 hover:text-green-500'}`}>
          <CheckCircle2 size={20} />
        </button>
      </div>
    </div>
  )
}