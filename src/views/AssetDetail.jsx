import React from 'react';
import { ArrowLeft, Settings, History, FileText, MoreHorizontal, Download } from 'lucide-react';
import jsPDF from 'jspdf'; // Importamos la librería

export default function AssetDetail({ onBack }) {

  // --- LÓGICA DE GENERACIÓN DE PDF ---
  const generateCertificate = (certData) => {
    const doc = new jsPDF();

    // 1. Marco y Diseño Gráfico
    doc.setLineWidth(1.5);
    doc.setDrawColor(0, 51, 153); // Azul oscuro
    doc.rect(10, 10, 190, 277); // Borde de página

    // 2. Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 153);
    doc.text("CERTIFICADO DE INSPECCIÓN", 105, 40, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("LEY 20.296 - TRANSPORTE VERTICAL", 105, 50, null, null, "center");

    // 3. Línea divisoria
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(30, 60, 180, 60);

    // 4. Datos del Activo
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("DATOS DEL EQUIPO", 20, 80);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Equipo: Ascensor Panorámico Torre B`, 20, 95);
    doc.text(`Ubicación: Edificio Torre Marina`, 20, 105);
    doc.text(`Rol MINVU: 12.334-9`, 20, 115);
    doc.text(`Marca: Otis Gen2`, 20, 125);

    // 5. Detalles de la Certificación (Dinámicos)
    doc.setFont("helvetica", "bold");
    doc.text("DETALLES DE LA INSPECCIÓN", 20, 150);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha de Inspección: ${certData.fecha}`, 20, 165);
    doc.text(`Inspector Responsable: ${certData.inspector}`, 20, 175);
    doc.text(`Resultado Técnico: ${certData.resultado.toUpperCase()}`, 20, 185);

    // 6. Sello de Aprobación Visual
    if (certData.resultado === 'Aprobado') {
        doc.setFillColor(220, 255, 220); // Verde claro fondo
        doc.rect(130, 160, 50, 20, 'F');
        doc.setTextColor(0, 128, 0); // Verde texto
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("APROBADO", 155, 173, null, null, "center");
    }

    // 7. Footer Legal
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Este documento certifica que el equipo ha sido inspeccionado conforme", 105, 250, null, null, "center");
    doc.text("a las normativas vigentes del Ministerio de Vivienda y Urbanismo.", 105, 255, null, null, "center");
    doc.text(`ID Certificado: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 105, 265, null, null, "center");

    // 8. Guardar archivo
    doc.save(`Certificado_${certData.fecha}.pdf`);
  };

  // Datos falsos para la tabla
  const historyData = [
    { fecha: "15 Nov 2024", inspector: "Jaime S.", resultado: "Aprobado" },
    { fecha: "20 Dic 2022", inspector: "Roberto M.", resultado: "Aprobado" },
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50 p-8">
      
      {/* HEADER NAVEGACIÓN */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4">
        <button onClick={onBack} className="bg-white p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ascensor Panorámico Torre B</h1>
          <p className="text-gray-500 text-sm">Edificio Torre Marina • Cliente #402</p>
        </div>
        <div className="ml-auto flex gap-3">
            <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Vigente
            </span>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-slate-900/20">
                Nueva Inspección
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQ */}
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Registro Visual</h3>
                <div className="relative h-48 rounded-xl overflow-hidden mb-3 group">
                    <img 
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt="Ascensor Cabina Principal" 
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">CABINA PRINCIPAL</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4 text-sm flex items-center gap-2">
                    <Settings size={16} className="text-blue-500" /> Ficha Técnica
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Marca</span><span className="font-semibold">Otis Gen2</span></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Capacidad</span><span className="font-semibold">8 Pers / 630 Kg</span></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500">Paradas</span><span className="font-semibold">12 Niveles</span></div>
                    <div className="flex justify-between pt-1"><span className="text-gray-500">Rol MINVU</span><span className="font-semibold text-blue-600 bg-blue-50 px-2 rounded">12.334-9</span></div>
                </div>
            </div>
        </div>

        {/* COLUMNA DER */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm"><History size={24} /></div>
                <div className="flex-1">
                    <h4 className="font-bold text-blue-900">Análisis de Vida Útil (CAPEX)</h4>
                    <p className="text-sm text-blue-700 mt-1">Se recomienda reemplazo de <strong>Cables de Tracción</strong> en 14 meses.</p>
                    <div className="mt-3 w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Historial de Certificaciones</h3>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Fecha</th>
                            <th className="px-6 py-3 font-medium">Inspector</th>
                            <th className="px-6 py-3 font-medium">Resultado</th>
                            <th className="px-6 py-3 font-medium text-right">Doc</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {historyData.map((cert, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{cert.fecha}</td>
                                <td className="px-6 py-4 text-gray-600">{cert.inspector}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${cert.resultado === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {cert.resultado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {/* BOTÓN DE DESCARGA CONECTADO */}
                                    <button 
                                        onClick={() => generateCertificate(cert)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all flex items-center gap-2 ml-auto font-medium"
                                        title="Descargar Certificado PDF"
                                    >
                                        <FileText size={16} /> PDF <Download size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}