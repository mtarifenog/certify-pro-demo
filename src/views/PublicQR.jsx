import React from 'react';
import { CheckCircle2, ShieldCheck, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf'; // 1. Importamos la librería

export default function PublicQR() {

  // 2. Lógica para generar el PDF Oficial
  const generatePDF = () => {
    const doc = new jsPDF();

    // --- DISEÑO DEL DOCUMENTO ---
    
    // Borde decorativo
    doc.setLineWidth(1);
    doc.setDrawColor(34, 197, 94); // Verde certificación
    doc.rect(10, 10, 190, 277); 

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text("CERTIFICADO DE CONFORMIDAD", 105, 40, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("LEY 20.296 - INSTALACIÓN Y MANTENCIÓN DE ASCENSORES", 105, 50, null, null, "center");

    // Línea separadora
    doc.setDrawColor(200);
    doc.line(30, 60, 180, 60);

    // Datos del Equipo
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("IDENTIFICACIÓN DEL EQUIPO", 20, 80);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Ubicación: Edificio Torre Marina - Av. Perú 100`, 20, 95);
    doc.text(`Equipo: Ascensor Pasajeros Torre A`, 20, 105);
    doc.text(`Marca / Modelo: Schindler 3300`, 20, 115);
    doc.text(`Rol MINVU: 12.344-5`, 20, 125);

    // Estado
    doc.setFillColor(220, 252, 231); // Fondo verde suave
    doc.rect(20, 140, 170, 25, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 128, 61); // Verde fuerte
    doc.setFontSize(16);
    doc.text("EQUIPO CERTIFICADO Y VIGENTE", 105, 157, null, null, "center");

    // Fechas
    doc.setTextColor(50);
    doc.setFontSize(12);
    doc.text(`Fecha Inspección: 15 Nov 2024`, 20, 190);
    doc.text(`Vencimiento: 15 Nov 2026`, 120, 190);

    // Firma Digital Simulada
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Documento generado electrónicamente por CertifyPro Cloud.", 105, 260, null, null, "center");
    doc.text(`Hash de Seguridad: ${Math.random().toString(36).substr(2, 12).toUpperCase()}`, 105, 265, null, null, "center");

    // Descargar
    doc.save("Certificado_Oficial_Ascensor_TorreA.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* FONDO DECORATIVO */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-10 blur-sm"
          alt="Ascensor Moderno"
        />
      </div>

      {/* TARJETA DE CERTIFICACIÓN */}
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100">
        
        {/* CABECERA DE ESTADO */}
        <div className="bg-green-600 text-white p-6 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">EQUIPO CERTIFICADO</h1>
          <p className="text-green-100 text-sm font-medium mt-1">Apto para uso público</p>
        </div>

        {/* DETALLE TÉCNICO */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-gray-900 font-bold text-lg">Ascensor Pasajeros Torre A</h2>
            <p className="text-gray-500 text-sm">Schindler 3300 • ID: 12.344-5</p>
            <div className="mt-4 flex justify-center gap-2">
               <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-bold border border-blue-100">Ley 20.296</span>
               <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold border border-gray-200">Residencial</span>
            </div>
          </div>

          {/* DATOS DE VIGENCIA */}
          <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b border-gray-100 py-6">
            <div className="text-center border-r border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold">Inspeccionado</p>
              <p className="text-gray-900 font-bold">15 Nov 2024</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase font-bold">Vence</p>
              <p className="text-green-600 font-bold">15 Nov 2026</p>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="space-y-3">
            
            {/* 3. BOTÓN CONECTADO A LA FUNCIÓN */}
            <button 
                onClick={generatePDF}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg active:scale-95"
            >
              <Download size={18} />
              Descargar Certificado Firmado
            </button>

            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck size={18} className="text-blue-600" />
              Verificar Empresa Certificadora
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            Validado por <span className="font-bold text-gray-600">CertifyPro Cloud</span>
            <ExternalLink size={10} />
          </p>
        </div>
      </div>
      
      {/* Botón de Pánico */}
      <button className="mt-8 text-red-500 text-sm font-bold flex items-center gap-2 hover:underline opacity-80 hover:opacity-100 transition-opacity relative z-20">
        <AlertTriangle size={16} />
        Reportar Falla o Emergencia
      </button>
    </div>
  );
}