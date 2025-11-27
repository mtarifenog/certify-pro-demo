import React from 'react';
import { ArrowLeft, Calendar, FileText, MoreHorizontal, Settings, History, AlertCircle } from 'lucide-react';

export default function AssetDetail() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-8">
      
      {/* HEADER NAVEGACIÓN */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4">
        <button className="bg-white p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ascensor Panorámico Torre B</h1>
          <p className="text-gray-500 text-sm">Edificio Corporativo Las Condes • Cliente #402</p>
        </div>
        <div className="ml-auto flex gap-3">
            <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Vigente
            </span>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
                Nueva Inspección
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: FOTOS Y DATOS CLAVE */}
        <div className="space-y-6">
            
            {/* GALERÍA DECORATIVA (LO QUE PEDISTE) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Registro Visual</h3>
                <div className="relative h-48 rounded-xl overflow-hidden mb-3 group">
                    <img 
                        src="https://images.unsplash.com/photo-1572697262272-35919e99277b?q=80&w=2070&auto=format&fit=crop" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt="Ascensor Principal" 
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        Cabina Principal
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop" className="h-24 w-full object-cover rounded-lg" alt="Sala Máquinas" />
                    <img src="https://plus.unsplash.com/premium_photo-1664302152996-2775f3a09968?q=80&w=2070&auto=format&fit=crop" className="h-24 w-full object-cover rounded-lg" alt="Pozo" />
                </div>
            </div>

            {/* ESPECIFICACIONES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4 text-sm flex items-center gap-2">
                    <Settings size={16} /> Ficha Técnica
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Marca</span>
                        <span className="font-semibold">Otis Gen2</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Capacidad</span>
                        <span className="font-semibold">8 Pers / 630 Kg</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Paradas</span>
                        <span className="font-semibold">12 Niveles</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span className="text-gray-500">Rol MINVU</span>
                        <span className="font-semibold text-blue-600">12.334-9</span>
                    </div>
                </div>
            </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL Y LINEA DE TIEMPO */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* ALERTA PREDICTIVA (TU IDEA DE CAPEX) */}
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <History size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900">Análisis de Vida Útil (CAPEX)</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        Según el desgaste actual, se recomienda el reemplazo de los <strong>Cables de Tracción</strong> en 14 meses.
                    </p>
                    <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-xs text-blue-500 mt-1 text-right">75% Vida Útil Consumida</p>
                </div>
            </div>

            {/* TABLA DE INSPECCIONES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Historial de Certificaciones</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Fecha</th>
                            <th className="px-6 py-3 font-medium">Inspector</th>
                            <th className="px-6 py-3 font-medium">Resultado</th>
                            <th className="px-6 py-3 font-medium text-right">Documento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900 font-medium">15 Nov 2024</td>
                            <td className="px-6 py-4 text-gray-600">Jaime S.</td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aprobado</span></td>
                            <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:underline flex items-center gap-1 justify-end ml-auto"><FileText size={14} /> PDF</button></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900 font-medium">20 Dic 2022</td>
                            <td className="px-6 py-4 text-gray-600">Roberto M.</td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aprobado</span></td>
                            <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:underline flex items-center gap-1 justify-end ml-auto"><FileText size={14} /> PDF</button></td>
                        </tr>
                        <tr className="hover:bg-gray-50 opacity-60">
                            <td className="px-6 py-4 text-gray-900 font-medium">18 Dic 2020</td>
                            <td className="px-6 py-4 text-gray-600">Roberto M.</td>
                            <td className="px-6 py-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Rechazado</span></td>
                            <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:underline flex items-center gap-1 justify-end ml-auto"><FileText size={14} /> PDF</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
      </div>
    </div>
  );
}