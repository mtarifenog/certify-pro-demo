import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FileCheck, Smartphone, QrCode, LogOut, 
  Building2, Lock, Mail, ArrowRight, CheckCircle2, Search, Bell, 
  ChevronRight, AlertTriangle, TrendingUp, AlertOctagon, Plus, MapPin, 
  MoreVertical, X, Loader2, ArrowLeft, Settings, History, Download, 
  ShieldCheck, ExternalLink, Camera, UploadCloud, Menu, FileText, Calendar, User
} from 'lucide-react';

// --- LIBRERÍAS REALES ---
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

// ==================================================================================
// 🔧 CONFIGURACIÓN DE CONEXIÓN
// ==================================================================================
const USE_MOCK_DATA = false; // MODO PRODUCCIÓN REAL

let supabase;

try {
  if (!USE_MOCK_DATA) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.error("Faltan variables de entorno Supabase");
    }
  } else {
    // MOCK FALLBACK
    console.warn("Modo Mock Activado");
    const mockDB = { clients: [], assets: [] };
    supabase = {
        from: (table) => ({ select: () => ({ order: async () => ({ data: [], error: null }), eq: async () => ({ count: 0 }) }), insert: async () => ({ error: null }) }),
        auth: { signInWithPassword: async () => ({ data: { user: { email: 'demo@certifypro.cl' } }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) }
    };
  }
} catch (err) { console.error("Error inicializando Supabase:", err); }

// ==================================================================================
// 1. LOGIN VIEW
// ==================================================================================
const LoginView = ({ onLogin }) => {
  const images = [
    "https://images.unsplash.com/photo-1572697262272-35919e99277b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535970793578-775347db1b86?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop"
  ];
  const [idx, setIdx] = useState(0);
  const [email, setEmail] = useState('mtarifenog@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { const i = setInterval(() => setIdx(p => (p + 1) % images.length), 5000); return () => clearInterval(i); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!supabase) throw new Error("Error de conexión Supabase.");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        {images.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-50' : 'opacity-0'}`} style={{backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent z-10"/>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">C</div><span className="font-bold text-xl tracking-tight">CertifyPro</span></div>
          <h1 className="text-4xl font-extrabold mb-4">El Estándar Digital para el Transporte Vertical.</h1>
          <div className="space-y-3 mt-8">{['Cumplimiento Ley 20.296', 'Trazabilidad QR', 'App Inspector Offline'].map((t, i) => (<div key={i} className="flex gap-3 text-sm font-medium text-slate-200"><CheckCircle2 className="text-green-400" size={18}/> {t}</div>))}</div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left"><h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2><p className="text-gray-500">Acceso corporativo seguro.</p></div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl" required /></div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <>Ingresar <ArrowRight size={18}/></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// 2. DASHBOARD VIEW
const DashboardView = ({ onNavigate }) => {
  const [stats, setStats] = useState({ clients: 0, assets: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function loadData() {
        if (!supabase) return;
        try {
            const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
            const { count: assetsCount } = await supabase.from('assets').select('*', { count: 'exact', head: true });
            const { count: criticalCount } = await supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'vencido');
            const { data: assetsData } = await supabase.from('assets').select('*, clients(name)').order('created_at', { ascending: false }).limit(5);
            
            setStats({ clients: clientsCount || 0, assets: assetsCount || 0, critical: criticalCount || 0 });
            setRecent(assetsData || []);
        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Radar de Negocio</h1></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm"><p className="text-xs font-bold text-gray-400 uppercase flex gap-2"><TrendingUp size={16}/> Facturación</p><p className="text-3xl font-bold text-gray-900 mt-2">{(stats.assets * 0.5).toFixed(1)} UF</p></div>
        <div className="bg-white p-6 rounded-xl border shadow-sm ring-1 ring-red-50"><p className="text-xs font-bold text-red-400 uppercase flex gap-2"><AlertOctagon size={16}/> Críticos</p><p className="text-3xl font-bold text-gray-900 mt-2">{stats.critical}</p></div>
        <div className="bg-white p-6 rounded-xl border shadow-sm"><p className="text-xs font-bold text-gray-400 uppercase flex gap-2"><Building2 size={16}/> Cobertura</p><p className="text-3xl font-bold text-gray-900 mt-2">{stats.clients}</p></div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center"><h3 className="font-bold text-gray-800">Inventario Reciente</h3>{loading && <Loader2 className="animate-spin text-blue-500" size={18} />}</div>
        <table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500 font-medium"><tr><th className="px-6 py-3">Cliente</th><th className="px-6 py-3">Activo</th><th className="px-6 py-3">Estado</th><th className="px-6 py-3 text-right">Acción</th></tr></thead>
          <tbody className="divide-y divide-gray-100">{recent.map(asset => (
            <tr key={asset.id} className="hover:bg-blue-50/50 cursor-pointer" onClick={() => onNavigate('detail')}>
              <td className="px-6 py-4 font-semibold text-gray-900">{asset.clients?.name}</td>
              <td className="px-6 py-4 text-gray-600">{asset.name}</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold flex w-fit gap-1 ${asset.status === 'vencido' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{asset.status === 'vencido' ? <AlertTriangle size={12}/> : <CheckCircle2 size={12}/>} {asset.status}</span></td>
              <td className="px-6 py-4 text-right text-blue-600 font-bold text-xs">Ver Ficha →</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

// 3. CLIENT PORTFOLIO VIEW
const ClientPortfolioView = ({ onNavigate }) => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({ name: '', address: '', admin: '' });

  const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=1000&auto=format&fit=crop"
  ];

  const loadClients = async () => {
    setLoading(true);
    if (!supabase) return;
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    setClients(data || []);
    setLoading(false);
  };

  useEffect(() => { loadClients(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    
    const randomImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];

    const { error } = await supabase.from('clients').insert([{ 
        name: newClient.name, 
        address: newClient.address, 
        admin_name: newClient.admin, 
        image_url: randomImage 
    }]);
    
    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        setShowModal(false);
        setNewClient({ name: '', address: '', admin: '' });
        loadClients();
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"><img src="https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2000" className="w-full h-full object-cover" /></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-white/90 backdrop-blur px-8 py-5 border-b flex justify-between items-center"><h1 className="text-2xl font-bold">Cartera de Clientes</h1><button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex gap-2 shadow-lg"><Plus size={20}/> Nuevo</button></div>
        
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {loading && <div className="col-span-full flex justify-center py-10"><Loader2 className="animate-spin" /></div>}
          
          <button onClick={() => setShowModal(true)} className="border-2 border-dashed border-gray-300 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all bg-white/50 backdrop-blur-sm group">
             <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 shadow-sm"><Plus size={32} /></div>
             <span className="font-bold text-lg">Registrar Nuevo Edificio</span>
          </button>

          {clients.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full min-h-[300px]">
              <div className="h-40 relative shrink-0 bg-gray-800">
                <img 
                    src={c.image_url || FALLBACK_IMAGES[0]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" 
                    onError={(e) => { e.target.src = FALLBACK_IMAGES[0]; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-white pr-4">
                  <h3 className="font-bold text-xl leading-tight mb-1 truncate">{c.name}</h3>
                  <p className="text-xs text-gray-300 flex gap-1 truncate"><MapPin size={12}/> {c.address || "Sin dirección"}</p>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div className="flex flex-wrap gap-2 mb-4">
                   <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-bold border border-blue-100 flex items-center gap-1"><Building2 size={12} /> Ver Equipos</span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="overflow-hidden mr-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">ADMINISTRADOR</p>
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{c.admin_name || c.admin || "Sin Asignar"}</p>
                  </div>
                  <button onClick={() => onNavigate('dashboard')} className="p-2 bg-gray-50 rounded-full hover:bg-blue-600 hover:text-white border shadow-sm transition-colors"><ArrowRight size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in">
            <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Nuevo Edificio</h3><button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-red-500" /></button></div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder="Nombre Edificio" className="w-full p-2 border rounded-lg" onChange={e => setNewClient({...newClient, name: e.target.value})} />
              <input required placeholder="Dirección" className="w-full p-2 border rounded-lg" onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <input required placeholder="Administrador" className="w-full p-2 border rounded-lg" onChange={e => setNewClient({...newClient, admin: e.target.value})} />
              <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">Guardar Cliente</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. ASSET DETAIL VIEW
const AssetDetailView = ({ onBack }) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Genera el QR con la URL de acceso público
    const publicLink = window.location.origin + window.location.pathname + '?view=public';
    QRCode.toDataURL(publicLink).then(setQrUrl);
  }, []);

  const generatePDF = async () => {
    const doc = new jsPDF();
    const certID = Math.random().toString(36).substr(2, 9).toUpperCase();
    // El QR en el PDF también debe usar la ruta pública correcta
    const qrImage = await QRCode.toDataURL(window.location.origin + window.location.pathname + '?view=public');
    doc.setLineWidth(1); doc.setDrawColor(34, 197, 94); doc.rect(10, 10, 190, 277);
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(30, 58, 138); doc.text("CERTIFICADO DE CONFORMIDAD", 105, 40, null, null, "center");
    doc.setFillColor(240); doc.rect(20, 155, 80, 60, 'FD'); doc.rect(110, 155, 80, 60, 'FD');
    doc.setFontSize(10); doc.setTextColor(150); doc.text("FOTO 1: CABINA", 60, 185, null, null, "center"); doc.text("FOTO 2: MÁQUINAS", 150, 185, null, null, "center");
    doc.addImage(qrImage, 'PNG', 150, 220, 35, 35); doc.save(`Certificado_${certID}.pdf`);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="bg-white p-2 rounded-lg border hover:text-blue-600"><ArrowLeft size={20}/></button>
          <div><h1 className="text-2xl font-bold">Ascensor Panorámico Torre B</h1><p className="text-gray-500">Edificio Torre Marina • Cliente #402</p></div>
          <div className="ml-auto flex gap-2"><button onClick={() => setShowQrModal(true)} className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-bold flex gap-2 hover:bg-gray-50"><QrCode size={20}/> Ver QR</button><button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold shadow-lg">Nueva Inspección</button></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border shadow-sm"><h3 className="font-bold text-gray-700 mb-3 text-sm">Registro Visual</h3><div className="h-48 rounded-xl overflow-hidden relative"><img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069" className="w-full h-full object-cover" /><div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">CABINA</div></div></div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm text-sm space-y-3"><h3 className="font-bold text-gray-700 mb-4 flex gap-2"><Settings size={16}/> Ficha Técnica</h3><div className="flex justify-between border-b pb-2"><span className="text-gray-500">Marca</span><span className="font-bold">Otis Gen2</span></div><div className="flex justify-between border-b pb-2"><span className="font-bold">630 Kg</span></div></div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4"><div className="bg-white p-2 rounded-lg text-blue-600"><History size={24}/></div><div className="flex-1"><h4 className="font-bold text-blue-900">Análisis de Vida Útil (CAPEX)</h4><p className="text-sm text-blue-700 mt-1">Se recomienda reemplazo de <strong>Cables de Tracción</strong> en 14 meses.</p><div className="mt-3 w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}/></div></div></div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 font-bold text-gray-800">Historial de Certificaciones</div>
              <table className="w-full text-left text-sm"><tbody>{[2024, 2022].map(year => (<tr key={year} className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-bold">15 Nov {year}</td><td className="px-6 py-4">Jaime S.</td><td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aprobado</span></td><td className="px-6 py-4 text-right"><button onClick={generatePDF} className="text-blue-600 font-bold flex items-center justify-end gap-1 ml-auto hover:underline"><FileText size={16}/> PDF <Download size={14}/></button></td></tr>))}</tbody></table>
            </div>
          </div>
        </div>
      </div>
      {showQrModal && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQrModal(false)}><div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center animate-in zoom-in" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold mb-2">Etiqueta Digital</h3><p className="text-sm text-gray-500 mb-6">Escanea esto con tu celular.</p><div className="bg-white border-2 border-dashed p-4 mb-6 rounded-xl flex justify-center">{qrUrl ? <img src={qrUrl} className="w-48 h-48" /> : <Loader2 className="animate-spin"/>}</div><button onClick={() => setShowQrModal(false)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Cerrar</button></div></div>}
    </div>
  );
}

// 5. INSPECTOR APP
const InspectorDemo = ({ onExit }) => (
  <div className="bg-gray-100 h-screen overflow-y-auto font-sans text-gray-900 max-w-md mx-auto shadow-2xl relative">
    <header className="bg-slate-900 text-white p-4 sticky top-0 z-20">
      <div className="flex justify-between items-center mb-4"><button onClick={onExit} className="text-slate-300 hover:text-white"><ChevronRight className="rotate-180" /></button><h1 className="font-bold">Inspección #4092</h1><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">JM</div></div>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex justify-between items-start"><div><span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Ascensor</span><h2 className="text-xl font-bold mt-1">Schindler 3300</h2><p className="text-xs text-slate-400">Torre A - Piso 1</p></div><div className="bg-white p-1 rounded"><QrCode className="text-black" size={24} /></div></div>
    </header>
    <main className="p-4 pb-24 space-y-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center"><div><h4 className="font-bold text-sm">Nivelación Parada</h4><p className="text-xs text-gray-400">Max +/- 10mm</p></div><div className="flex gap-2"><div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-300"><X size={18}/></div><div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 size={18}/></div></div></div>
      <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-sm flex justify-between items-center"><div><h4 className="font-bold text-sm text-red-700">Cables Tracción</h4><p className="text-xs text-gray-400">Sin hilos cortados</p></div><div className="flex gap(2"><div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-600"><X size={18}/></div><div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-300"><CheckCircle2 size={18}/></div></div></div>
      <div className="grid grid-cols-2 gap(3 mt-6"><button className="border-2 border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center text-gray-400 bg-white"><Camera size={20}/><span className="text-[10px] font-bold mt-1">FOTO SALA</span></button><div className="relative rounded-xl h-24 bg-gray-900 overflow-hidden group"><img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=300" className="w-full h-full object-cover opacity-80" /><div className="absolute inset-0 flex items-center justify-center"><div className="bg-green-500 text-white p-1 rounded-full"><CheckCircle2 size={16}/></div></div></div></div>
    </main>
    <div className="fixed bottom-0 max-w-md w-full p-4 bg-white/90 backdrop-blur border-t z-20"><button onClick={onExit} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap(2 shadow-lg"><UploadCloud size={20}/> Finalizar Inspección</button></div>
  </div>
);

// 6. PUBLIC QR VIEW
const PublicQRDemo = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('certificate');
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Genera el QR con la URL de acceso público
    const publicLink = window.location.origin + window.location.pathname + '?view=public';
    QRCode.toDataURL(publicLink).then(setQrUrl);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setLineWidth(1); doc.setDrawColor(34, 197, 94); doc.rect(10, 10, 190, 277);
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(30, 58, 138); 
    doc.text("CERTIFICADO DE CONFORMIDAD", 105, 40, null, null, "center");
    doc.setFillColor(240); doc.rect(20, 155, 80, 60, 'FD'); doc.rect(110, 155, 80, 60, 'FD');
    doc.setFontSize(10); doc.setTextColor(150); doc.text("FOTO 1: CABINA", 60, 185, null, null, "center");
    doc.text("FOTO 2: MÁQUINAS", 150, 185, null, null, "center");
    if(qrUrl) doc.addImage(qrUrl, 'PNG', 160, 230, 30, 30);
    doc.save("Certificado_Oficial_Ascensor.pdf");
  };

  const bitacora = [
    { fecha: "15 Nov 2024", evento: "Certificación Anual", tecnico: "Jaime Soto", s: "Aprobado" },
    { fecha: "10 Oct 2024", evento: "Mantención Preventiva", tecnico: "Carlos R.", s: "Ok" },
    { fecha: "12 Sep 2024", evento: "Cambio de Rodamientos", tecnico: "Carlos R.", s: "Corregido" },
    { fecha: "10 Ago 2024", evento: "Mantención Preventiva", tecnico: "Carlos R.", s: "Ok" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069" className="w-full h-full object-cover opacity-10 blur-sm" alt="bg" /></div>
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="bg-green-600 text-white p-6 text-center shrink-0">
          <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm"><CheckCircle2 size={24} className="text-white" /></div>
          <h1 className="text-xl font-bold tracking-tight">EQUIPO VIGENTE</h1>
          <p className="text-green-100 text-xs font-medium uppercase tracking-wider">Operativo y Seguro</p>
        </div>
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button onClick={() => setActiveTab('certificate')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'certificate' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <FileText size={16} /> Certificado
          </button>
          <button onClick={() => setActiveTab('bitacora')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap(2 transition-colors ${activeTab === 'bitacora' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}><History size={16} /> Bitácora</button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 bg-white">
          {activeTab === 'certificate' && (
            <div className="p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-center mb-6"><h2 className="text-gray-900 font-bold text-lg">Ascensor Pasajeros Torre A</h2><p className="text-gray-500 text-sm">Schindler 3300 • ID: 12.344-5</p></div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6 flex justify-between items-center"><div><p className="text-[10px] text-blue-400 font-bold uppercase">Última Mantención</p><p className="text-lg font-bold text-blue-900">15 Nov 2024</p></div><div className="text-right"><p className="text-[10px] text-blue-400 font-bold uppercase">Próxima Visita</p><p className="text-sm font-bold text-blue-600">15 Dic 2024</p></div></div>
              <div className="space-y-3">
                <button onClick={generatePDF} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap(2 shadow-md"><Download size={18}/> Descargar PDF Oficial</button>
                <div className="text-center mt-4"><p className="text-xs text-gray-400">Certificación Ley 20.296</p></div>
              </div>
            </div>
          )}
          {activeTab === 'bitacora' && (
            <div className="divide-y divide-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {bitacora.map((log, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap(3"><div className="bg-gray-100 p-2 rounded-lg text-gray-500 mt-1"><Calendar size={16} /></div><div className="flex-1"><div className="flex justify-between items-start"><h4 className="text-sm font-bold text-gray-900">{log.evento}</h4><span className="text-xs text-gray-400 font-medium">{log.fecha}</span></div><p className="text-xs text-gray-500 mt-1 flex items-center gap(1"><User size={10} /> {log.tecnico}</p><span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${['Aprobado', 'Ok'].includes(log.s) ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{log.s}</span></div></div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-3 text-center border-t shrink-0"><p className="text-[10px] text-gray-400 flex items-center justify-center gap(1">Plataforma CertifyPro Cloud <ExternalLink size={8} /></p></div>
      </div>
      <button className="mt-6 text-red-500 text-xs font-bold flex items-center gap(2 hover:bg-red-50 px-4 py-2 rounded-full transition-all relative z-20"><AlertTriangle size={14} /> Reportar Falla</button>
    </div>
  );
};

// ==================================================================================
// 🧠 COMPONENTE PRINCIPAL (RUTAS)
// ==================================================================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'public') {
      setIsLoggedIn(true);
      setCurrentView('public');
    }
    
    if(supabase && supabase.auth) {
        supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggedIn(!!session);
        });
    }
  }, []);

  if (!isLoggedIn && currentView !== 'public') return <LoginView onLogin={() => setIsLoggedIn(true)} />;

  if (['dashboard', 'clients', 'detail'].includes(currentView)) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
        <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col h-screen sticky top-0">
          <div className="p-6 border-b border-slate-800 flex gap-2 items-center"><div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">C</div><span className="font-bold text-xl">CertifyPro</span></div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'dashboard', icon: <LayoutDashboard size={20}/>, label: 'Radar de Negocio' },
              { id: 'clients', icon: <Users size={20}/>, label: 'Cartera Clientes' },
              { id: 'inspector', icon: <Smartphone size={20}/>, label: 'App Inspector' },
              { id: 'public', icon: <QrCode size={20}/>, label: 'QR Público' },
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${currentView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                {item.icon} <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-xl p-4 mb-3"><p className="text-xs text-slate-400 mb-1">Saldo</p><p className="text-xl font-bold">14 Créditos</p></div>
            <button onClick={() => { setIsLoggedIn(false); if(supabase && supabase.auth) supabase.auth.signOut(); }} className="flex gap-2 text-slate-400 hover:text-white text-sm px-2"><LogOut size={16}/> Salir</button>
          </div>
        </aside>

        <main className="flex-1 h-screen overflow-hidden flex flex-col">
          <header className="h-16 bg-white border-b flex justify-between items-center px-6 shrink-0">
            <div className="flex items-center gap-4 text-gray-400">
              <Menu className="md:hidden text-gray-600" />
              <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-64"><Search size={18}/><input placeholder="Buscar..." className="bg-transparent outline-none text-sm w-full"/></div>
            </div>
            <div className="flex items-center gap-4"><Bell size={20} className="text-gray-400"/><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">JA</div></div>
          </header>
          <div className="flex-1 overflow-hidden">
            {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
            {currentView === 'clients' && <ClientPortfolioView onNavigate={setCurrentView} />}
            {currentView === 'detail' && <AssetDetailView onBack={() => setCurrentView('dashboard')} />}
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'inspector') return <div className="bg-slate-800 min-h-screen flex items-center justify-center py-10 overflow-y-auto"><div className="relative"><button onClick={() => setCurrentView('dashboard')} className="absolute -right-12 top-0 text-white/50 hover:text-white text-xs font-bold -rotate-90 origin-left">VOLVER AL ADMIN</button><InspectorDemo onExit={() => setCurrentView('dashboard')} /></div></div>;
  if (currentView === 'public') return <PublicQRDemo onExit={() => setCurrentView('dashboard')} />;
}