import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FileCheck, Smartphone, QrCode, LogOut, 
  Building2, Lock, Mail, ArrowRight, CheckCircle2, Search, Bell, 
  ChevronRight, AlertTriangle, TrendingUp, AlertOctagon, Plus, MapPin, 
  MoreVertical, X, Loader2, ArrowLeft, Settings, History, Download, 
  ShieldCheck, ExternalLink, Camera, UploadCloud, Menu, FileText, Calendar, User, Printer, Share2, MessageSquare, Menu as MenuIcon
} from 'lucide-react';

// --- LIBRERÍAS REALES ---
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

// ==================================================================================
// 🔧 CONFIGURACIÓN
// ==================================================================================
const USE_MOCK_DATA = false; 

let supabase;
try {
  if (!USE_MOCK_DATA) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (err) { console.error("Error init Supabase:", err); }

// --- IMÁGENES DE FONDO (Para usar en toda la app) ---
const BG_IMAGES = {
  login: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop", // Ascensor moderno
  dashboard: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // Edificios cristal
  clients: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=2074&auto=format&fit=crop", // Ciudad vista aérea
  inspector: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop", // Maquinaria técnica
  public: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop" // Escalera mecánica
};

// ==================================================================================
// 1. LOGIN VIEW (MEJORADO)
// ==================================================================================
const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('mtarifenog@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!supabase) throw new Error("Conexión no establecida");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) { alert(error.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Fondo Global con Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={BG_IMAGES.login} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col md:flex-row h-screen">
        {/* Izquierda: Branding */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-center text-white">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="font-bold text-2xl">C</span>
             </div>
             <span className="text-3xl font-bold tracking-tight">CertifyPro</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">Gestión Inteligente de <span className="text-blue-400">Transporte Vertical</span>.</h1>
          <p className="text-lg text-slate-300 max-w-md">Plataforma integral para certificación, mantenimiento y trazabilidad de ascensores y escaleras mecánicas.</p>
        </div>

        {/* Derecha: Formulario */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Bienvenido</h2>
              <p className="text-gray-500">Ingresa a tu panel de control</p>
            </div>
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Correo Corporativo</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                  {loading ? <Loader2 className="animate-spin"/> : <>Iniciar Sesión <ArrowRight size={18}/></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 2. DASHBOARD VIEW (FONDO PREMIUM)
// ==================================================================================
const DashboardView = ({ onNavigate }) => {
  const [stats, setStats] = useState({ clients: 0, assets: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function loadData() {
        if (!supabase) return;
        try {
            const { count: cC } = await supabase.from('clients').select('*', { count: 'exact', head: true });
            const { count: cA } = await supabase.from('assets').select('*', { count: 'exact', head: true });
            const { count: cCr } = await supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'vencido');
            const { data: iD } = await supabase.from('inspections').select('*').order('created_at', { ascending: false }).limit(5);
            setStats({ clients: cC || 0, assets: cA || 0, critical: cCr || 0 });
            setRecent(iD || []);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    loadData();
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
       {/* Fondo Dashboard */}
       <div className="absolute inset-0 z-0">
          <img src={BG_IMAGES.dashboard} className="w-full h-full object-cover opacity-10" />
       </div>

       <div className="relative z-10 p-8 h-full overflow-y-auto pb-24">
          <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Radar de Negocio</h1><p className="text-gray-500">Resumen de operaciones en tiempo real.</p></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { l: 'Facturación', v: `${(stats.assets * 0.5).toFixed(1)} UF`, i: <TrendingUp/>, c: 'text-blue-600', bg: 'bg-blue-50' },
              { l: 'Críticos', v: stats.critical, i: <AlertOctagon/>, c: 'text-red-600', bg: 'bg-red-50' },
              { l: 'Cobertura', v: stats.clients, i: <Building2/>, c: 'text-emerald-600', bg: 'bg-emerald-50' }
            ].map((k, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 ${k.bg} ${k.c} rounded-xl flex items-center justify-center mb-3`}>{k.i}</div>
                <p className="text-xs font-bold text-gray-400 uppercase">{k.l}</p>
                <p className="text-3xl font-black text-gray-900">{k.v}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg text-gray-800">Últimas Inspecciones</h3>{loading && <Loader2 className="animate-spin text-blue-500" />}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-gray-50/50 text-gray-500 font-medium uppercase text-xs"><tr><th className="px-8 py-4">Cliente / Activo</th><th className="px-8 py-4">Fecha</th><th className="px-8 py-4">Estado</th><th className="px-8 py-4 text-right">Acción</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {recent.map(r => (
                    <tr key={r.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => onNavigate('detail')}>
                      <td className="px-8 py-4 font-semibold text-gray-900">{r.client_name || "Sin Nombre"}</td>
                      <td className="px-8 py-4 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'Reprobado' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{r.status}</span></td>
                      <td className="px-8 py-4 text-right text-blue-600 font-bold text-xs">Ver Informe →</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
       </div>
    </div>
  );
};

// ==================================================================================
// 3. CLIENT PORTFOLIO (ESTÉTICA HERO MEJORADA)
// ==================================================================================
const ClientPortfolioView = ({ onNavigate }) => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', address: '', admin: '' });

  // Imágenes de arquitectura para fallback
  const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1000&auto=format&fit=crop"
  ];

  const loadClients = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    setClients(data || []);
  };
  useEffect(() => { loadClients(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const img = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
    const { error } = await supabase.from('clients').insert([{ name: newClient.name, address: newClient.address, admin_name: newClient.admin, image_url: img }]);
    if (!error) { setShowModal(false); setNewClient({name:'', address:'', admin:''}); loadClients(); }
  };

  return (
    <div className="relative h-full flex flex-col">
       {/* Fondo Decorativo */}
       <div className="absolute inset-0 z-0"><img src={BG_IMAGES.clients} className="w-full h-full object-cover opacity-5 grayscale-[20%]" /></div>
       
       <div className="relative z-10 flex flex-col h-full">
          <div className="px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
             <div><h1 className="text-2xl font-bold text-gray-900">Cartera de Clientes</h1></div>
             <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex gap-2 shadow-lg shadow-blue-500/30 transition-all"><Plus size={20}/> Nuevo Edificio</button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
             {clients.map(c => (
               <div key={c.id} className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col h-full min-h-[320px] cursor-pointer transform hover:-translate-y-1" onClick={() => onNavigate('dashboard')}>
                  <div className="h-48 relative shrink-0 bg-gray-900">
                     <img src={c.image_url || HERO_IMAGES[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" onError={(e) => e.target.src = HERO_IMAGES[0]} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"/>
                     <div className="absolute bottom-4 left-5 right-5 text-white">
                        <h3 className="font-bold text-xl leading-tight shadow-black drop-shadow-md mb-1 truncate">{c.name}</h3>
                        <p className="text-xs text-gray-300 flex gap-1 truncate opacity-90"><MapPin size={12}/> {c.address}</p>
                     </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                     <div className="flex gap-2 mb-4"><span className="bg-blue-50 text-blue-700 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border border-blue-100">Activo</span></div>
                     <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase">Administrador</p><p className="text-sm font-bold text-gray-800 truncate max-w-[140px]">{c.admin_name || "Sin Asignar"}</p></div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors"><ArrowRight size={16}/></div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
       </div>
       {showModal && (
         <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
               <h3 className="font-bold text-xl mb-6 text-gray-900">Registrar Nuevo Edificio</h3>
               <form onSubmit={handleCreate} className="space-y-4">
                  <input placeholder="Nombre Edificio" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setNewClient({...newClient, name: e.target.value})} />
                  <input placeholder="Dirección" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setNewClient({...newClient, address: e.target.value})} />
                  <input placeholder="Administrador" className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setNewClient({...newClient, admin: e.target.value})} />
                  <div className="flex gap-3 mt-6 pt-2"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancelar</button><button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30">Guardar</button></div>
               </form>
            </div>
         </div>
       )}
    </div>
  );
};

// ==================================================================================
// 4. ASSET DETAIL VIEW
// ==================================================================================
const AssetDetailView = ({ onBack }) => {
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const PUBLIC_URL = window.location.origin + window.location.pathname + '?view=public';

  useEffect(() => { QRCode.toDataURL(PUBLIC_URL).then(setQrUrl); }, []);

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      <div className="absolute inset-0 z-0"><img src={BG_IMAGES.inspector} className="w-full h-full object-cover opacity-5 grayscale" /></div>
      <div className="relative z-10 max-w-6xl mx-auto">
         <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="bg-white p-2.5 rounded-xl border shadow-sm hover:text-blue-600 transition-colors"><ArrowLeft size={20}/></button>
            <div><h1 className="text-3xl font-bold text-gray-900">Ascensor Panorámico Torre B</h1><p className="text-gray-500">Edificio Torre Marina • Cliente #402</p></div>
            <div className="ml-auto flex gap-3">
               <button onClick={() => setShowQr(true)} className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold flex gap-2 hover:bg-gray-50 transition-colors shadow-sm"><QrCode size={20}/> Ver QR</button>
            </div>
         </div>
         
         {/* Contenido Ficha */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Registro Visual</h3>
               <div className="aspect-video rounded-xl overflow-hidden relative bg-gray-100 group">
                  <img src={BG_IMAGES.login} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">CABINA</div>
               </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/20 flex items-start gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                  <div className="bg-white/20 p-3 rounded-xl"><History size={24}/></div>
                  <div><h4 className="font-bold text-lg">Análisis de Vida Útil (CAPEX)</h4><p className="text-blue-100 mt-1 text-sm opacity-90">Se recomienda reemplazo de <strong>Cables de Tracción</strong> en 14 meses.</p></div>
               </div>
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 font-bold text-gray-700 text-sm uppercase tracking-wide">Historial</div>
                  <div className="p-6 text-center text-gray-400 text-sm">Historial disponible en PDF.</div>
               </div>
            </div>
         </div>
      </div>
      {showQr && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in">
              <h3 className="text-xl font-bold mb-2">Etiqueta Digital</h3>
              <p className="text-sm text-gray-500 mb-6 break-all">{PUBLIC_URL}</p>
              <div className="bg-white border-4 border-slate-900 p-2 mb-6 rounded-2xl inline-block">{qrUrl && <img src={qrUrl} className="w-48 h-48 rounded-lg"/>}</div>
              <button onClick={() => setShowQr(false)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800">Cerrar</button>
           </div>
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// 5. INSPECTOR APP (MOVIL + PRETTY)
// ==================================================================================
const InspectorDemo = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('checklist'); 
  const [checklist, setChecklist] = useState([{ id: 1, title: "Nivelación", desc: "Max +/- 10mm", result: null }, { id: 2, title: "Cables Tracción", desc: "Sin hilos cortados", result: null }, { id: 3, title: "Iluminación", desc: "Luxometría > 50 lux", result: null }]);
  const [saving, setSaving] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  
  useEffect(() => { QRCode.toDataURL(window.location.origin + '/?view=public').then(setQrUrl); }, []);

  const handleSave = async () => {
    setSaving(true);
    const status = checklist.some(i => i.result === false) ? 'Reprobado' : 'Aprobado';
    try {
       if(!supabase) throw new Error("Sin conexión");
       const { error } = await supabase.from('inspections').insert([{ client_name: "Torre Marina", status, checklist_data: checklist, inspector_email: "inspector@certify.cl" }]);
       if(error) throw error;
       alert("Guardado Exitoso!"); onExit();
    } catch(e) { alert(e.message); } finally { setSaving(false); }
  };

  return (
    <div className="bg-slate-100 h-screen overflow-y-auto font-sans text-gray-900 max-w-md mx-auto shadow-2xl relative">
      <div className="absolute inset-0 z-0"><img src={BG_IMAGES.inspector} className="w-full h-full object-cover opacity-5" /></div>
      <header className="bg-slate-900 text-white p-5 sticky top-0 z-20 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4"><button onClick={onExit} className="text-white/80 hover:text-white"><ChevronRight className="rotate-180"/></button><h1 className="font-bold">Inspección #4092</h1><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white/20">JM</div></div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex justify-between items-center"><div><span className="bg-blue-500/20 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-blue-500/30">Ascensor</span><h2 className="text-lg font-bold mt-1">Schindler 3300</h2></div><div className="bg-white p-1.5 rounded-lg"><QrCode className="text-slate-900" size={20}/></div></div>
      </header>
      <div className="relative z-10 p-4 pb-24 space-y-4">
         <div className="flex bg-white p-1 rounded-xl shadow-sm mb-2"><button onClick={() => setActiveTab('checklist')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'checklist' ? 'bg-slate-900 text-white shadow' : 'text-gray-500'}`}>Checklist</button><button onClick={() => setActiveTab('sticker')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'sticker' ? 'bg-slate-900 text-white shadow' : 'text-gray-500'}`}>Sticker QR</button></div>
         
         {activeTab === 'checklist' && checklist.map(i => (
            <div key={i.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
               <div><h4 className="font-bold text-sm text-gray-800">{i.title}</h4><p className="text-xs text-gray-400">{i.desc}</p></div>
               <div className="flex gap-2"><button onClick={() => {const n=[...checklist]; n.find(x=>x.id===i.id).result=false; setChecklist(n)}} className={`p-2 rounded-xl transition-colors ${i.result===false ? 'bg-red-500 text-white':'bg-gray-100 text-gray-300'}`}><X size={18}/></button><button onClick={() => {const n=[...checklist]; n.find(x=>x.id===i.id).result=true; setChecklist(n)}} className={`p-2 rounded-xl transition-colors ${i.result===true ? 'bg-green-500 text-white':'bg-gray-100 text-gray-300'}`}><CheckCircle2 size={18}/></button></div>
            </div>
         ))}
         {activeTab === 'sticker' && (
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-900 shadow-xl text-center">
               <h3 className="text-xl font-black uppercase mb-1">Equipo Certificado</h3><p className="text-[10px] font-bold tracking-widest text-gray-400 mb-6">LEY 20.296</p>
               <div className="bg-slate-900 p-2 rounded-xl inline-block mb-4 shadow-lg">{qrUrl && <img src={qrUrl} className="w-40 h-40 rounded-lg border-2 border-white"/>}</div>
               <p className="text-xs text-gray-500 font-medium">Escanea con tu cámara</p>
            </div>
         )}
      </div>
      {activeTab === 'checklist' && <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20"><button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2">{saving ? <Loader2 className="animate-spin"/> : <UploadCloud/>} Finalizar</button></div>}
    </div>
  );
}

// 6. PUBLIC VIEW (LIMPIO Y ATRACTIVO)
const PublicQRDemo = ({ onExit }) => {
  const [qrUrl, setQrUrl] = useState('');
  useEffect(() => { QRCode.toDataURL(window.location.href).then(setQrUrl); }, []);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
       <div className="absolute inset-0 z-0"><img src={BG_IMAGES.public} className="w-full h-full object-cover" /> <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div></div>
       <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative z-10">
          <div className="bg-emerald-500 text-white p-8 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md"><CheckCircle2 size={32} /></div>
             <h1 className="text-2xl font-black tracking-tight">EQUIPO VIGENTE</h1>
             <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1">Operativo y Seguro</p>
          </div>
          <div className="p-8 text-center">
             <h2 className="text-gray-900 font-bold text-xl">Ascensor Torre A</h2>
             <p className="text-gray-500 text-sm mb-6">ID: 12.344-5 • Schindler 3300</p>
             <div className="space-y-3">
                <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-lg hover:bg-slate-800 transition-colors"><Download size={18}/> Descargar Certificado</button>
                <div className="text-[10px] text-gray-400 mt-4">Validado por CertifyPro Cloud</div>
             </div>
          </div>
       </div>
    </div>
  );
};

// MAIN APP
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isPublic, setIsPublic] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para menú móvil

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if(p.get('view') === 'public') { setIsPublic(true); return; }
    if(supabase) supabase.auth.onAuthStateChange((_, s) => setIsLoggedIn(!!s));
  }, []);

  if(isPublic) return <PublicQRDemo />;
  if(!isLoggedIn) return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  if(currentView === 'inspector') return <InspectorDemo onExit={() => setCurrentView('dashboard')} />;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative">
       {/* Sidebar Móvil (Overlay) */}
       {menuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMenuOpen(false)}></div>}
       
       <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
          <div className="p-8"><span className="text-2xl font-bold">CertifyPro</span></div>
          <nav className="flex-1 px-4 space-y-2">
             {[
               {id:'dashboard', l:'Radar', i:<LayoutDashboard size={20}/>}, 
               {id:'clients', l:'Cartera', i:<Users size={20}/>}, 
               {id:'inspector', l:'App Inspector', i:<Smartphone size={20}/>}
             ].map(m => (
                <button key={m.id} onClick={() => { setCurrentView(m.id); setMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${currentView===m.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                   {m.i} {m.l}
                </button>
             ))}
          </nav>
          <div className="p-6"><button onClick={() => supabase?.auth.signOut()} className="flex gap-2 text-slate-400 hover:text-white text-sm"><LogOut size={16}/> Salir</button></div>
       </aside>

       <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Header Móvil */}
          <header className="h-16 bg-white border-b border-gray-100 flex justify-between items-center px-6 shrink-0 z-20">
             <div className="flex items-center gap-4">
                <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(true)}><MenuIcon/></button>
                <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm text-gray-500 w-64 border border-gray-100"><Search size={16}/> Buscar...</div>
             </div>
             <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">JA</div>
          </header>
          <div className="flex-1 overflow-hidden relative">
             {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
             {currentView === 'clients' && <ClientPortfolioView onNavigate={setCurrentView} />}
             {currentView === 'detail' && <AssetDetailView onBack={() => setCurrentView('dashboard')} />}
          </div>
       </main>
    </div>
  );
}