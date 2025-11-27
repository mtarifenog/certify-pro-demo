import React from 'react';
import { Building2, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login({ onLogin }) {

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(); 
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* ================= COLUMNA IZQUIERDA (VISUAL / VENTAS) ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        
        {/* CARRUSEL DE IMÁGENES DE FONDO (Temática: Transporte Vertical) */}
        <div 
            className="absolute inset-0 z-0 opacity-50"
            style={{
                // Definimos la animación en el estilo inline para no usar CSS externo
                animation: 'slideshow 20s infinite alternate',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        ></div>
        
        {/* Capa oscura para mejorar lectura */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent z-10"></div>

        {/* CONTENIDO DE TEXTO */}
        <div className="relative z-20 flex flex-col justify-between p-16 h-full text-white">
           <div>
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-900/50">
                    C
                </div>
                <span className="text-2xl font-bold tracking-tight">CertifyPro</span>
             </div>
             <h1 className="text-5xl font-extrabold leading-tight mb-6">
               El Estándar Digital para el Transporte Vertical.
             </h1>
             <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
               Gestiona la certificación, mantenimiento y trazabilidad legal de ascensores, escaleras mecánicas y activos críticos en una sola plataforma en la nube.
             </p>
           </div>

           {/* PUNTOS CLAVE */}
           <div className="space-y-4 text-sm font-medium text-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-1 rounded-full"><CheckCircle2 size={18} className="text-green-400" /></div>
                <span>Cumplimiento Normativo (Ley 20.296 / DS44)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-1 rounded-full"><CheckCircle2 size={18} className="text-blue-400" /></div>
                <span>Trazabilidad con Sellos QR Inmutables</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-1 rounded-full"><CheckCircle2 size={18} className="text-purple-400" /></div>
                <span>App Móvil Offline para Inspectores</span>
              </div>
           </div>
        </div>
      </div>

      {/* ================= COLUMNA DERECHA (FORMULARIO) ================= */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-gray-50 lg:bg-white">
        <div className="max-w-md w-full space-y-8">
          
          <div className="lg:hidden text-center mb-8">
             <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
                <span className="text-xl font-bold text-gray-900">CertifyPro</span>
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
          </div>

          <div className="hidden lg:block">
             <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido de nuevo</h2>
             <p className="text-gray-500 mt-2">Accede a tu panel de control de certificaciones.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={20} /></div>
                <input id="email" name="email" type="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" placeholder="nombre@empresa.com" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={20} /></div>
                <input id="password" name="password" type="password" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99]">
              Ingresar a la Plataforma <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 lg:bg-white text-gray-500">¿Tu empresa aún no tiene cuenta?</span>
            </div>
            <div className="mt-6 flex justify-center">
              <a href="#" className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                <Building2 size={16} /> Solicitar Demo Corporativa
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ESTILOS DE ANIMACIÓN (FOTOS DE ASCENSORES Y ESCALERAS) */}
      <style>{`
        @keyframes slideshow {
          0% { background-image: url('https://images.unsplash.com/photo-1572697262272-35919e99277b?q=80&w=2070&auto=format&fit=crop'); } /* Ascensor Panorámico */
          33% { background-image: url('https://images.unsplash.com/photo-1535970793578-775347db1b86?q=80&w=2070&auto=format&fit=crop'); } /* Escaleras Mecánicas Mall */
          66% { background-image: url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop'); } /* Sala de Máquinas */
          100% { background-image: url('https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2000&auto=format&fit=crop'); } /* Arquitectura Vertical */
        }
      `}</style>
    </div>
  );
}