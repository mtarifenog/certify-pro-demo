import React, { useEffect, useState } from 'react';
import { ChevronRight, CheckCircle2, AlertTriangle, Building2, Bell, Search, TrendingUp, AlertOctagon, Loader2 } from 'lucide-react';

// --- EN TU PROYECTO LOCAL: DESCOMENTA ESTO ---
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// --- SIMULACIÓN (SOLO PARA ESTA DEMO PREVIEW) ---
// (Borra todo este bloque 'const supabase = ...' en tu PC)
const mockAssets = [
  {
    id: 1,
    name: 'Ascensor Panorámico Torre B',
    type: 'elevator',
    location: 'Hall Central',
    status: 'vigente',
    next_certification_date: '2025-11-15',
    clients: { name: 'Edificio Torre Marina' }
  },
  {
    id: 2,
    name: 'Ascensor Servicio',
    type: 'elevator',
    location: 'Acceso Proveedores',
    status: 'por_vencer',
    next_certification_date: '2025-12-01',
    clients: { name: 'Edificio Torre Marina' }
  },
  {
    id: 3,
    name: 'Montacargas Industrial',
    type: 'elevator',
    location: 'Zona de Despacho',
    status: 'vencido',
    next_certification_date: '2024-05-01',
    clients: { name: 'Fábrica Calzados B' }
  }
];

const supabase = {
  from: (table) => {
    if (table === 'assets') {
      return {
        select: () => ({
          order: () => ({
            limit: async () => {
              await new Promise(r => setTimeout(r, 600));
              return { data: mockAssets, error: null };
            }
          }),
          eq: async (field, value) => {
             // Simulación básica de conteo
             const count = mockAssets.filter(a => a[field] === value).length;
             return { count, error: null };
          }
        })
      };
    }
    // Simulamos conteo para 'clients'
    if (table === 'clients') {
        return {
            select: async () => ({ count: 4, error: null })
        }
    }
    return { select: async () => ({ count: 0 }) };
  }
};
// -----------------------------------------------------

export default function Dashboard({ onNavigate }) {
  
  const [stats, setStats] = useState({
    totalClients: 0,
    vencidos: 0,
    porVencer: 0,
    totalAssets: 0
  });
  
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);

      // 1. Cargar Activos Recientes (Simulado)
      const { data: assetsData } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentAssets(assetsData || []);

      // 2. Simular Estadísticas
      // En tu código real esto viene de la BD, aquí lo forzamos para la demo visual
      setStats({
        totalClients: 4,
        totalAssets: 15,
        vencidos: 1,     // Simulado: Montacargas vencido
        porVencer: 2     // Simulado: Ascensor por vencer
      });
      
      setLoading(false);
    }

    loadDashboardData();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-64">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} />
            {stats.vencidos > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
          </button>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
            JA
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Radar de Negocio</h1>
          <p className="text-gray-500">Resumen en tiempo real de tu base de datos.</p>
        </div>

        {/* KPIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* TARJETA 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={16} /> Facturación Potencial
            </p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-gray-900">{(stats.totalAssets * 0.5).toFixed(1)} UF</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                Base instalada
              </span>
            </div>
          </div>

          {/* TARJETA 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm ring-1 ring-red-50 hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon size={16} /> Equipos Críticos
            </p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-gray-900">{stats.vencidos}</span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                Vencidos
              </span>
            </div>
          </div>

          {/* TARJETA 3 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={16} /> Cobertura
            </p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-gray-900">{stats.totalClients}</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                Edificios Activos
              </span>
            </div>
          </div>
        </div>

        {/* TABLA DE ACTIVOS RECIENTES */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Próximos Vencimientos</h3>
            {loading && <Loader2 className="animate-spin text-blue-500" size={18} />}
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Activo</th>
                <th className="px-6 py-3">Vencimiento</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => onNavigate('detail')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        <Building2 size={16} />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {asset.clients?.name || "Sin Asignar"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="block font-medium text-gray-900">{asset.name}</span>
                    <span className="text-xs text-gray-400 capitalize">{asset.type} • {asset.location}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {asset.next_certification_date || "Sin Fecha"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold text-xs hover:underline flex items-center justify-end gap-1 ml-auto group-hover:translate-x-1 transition-transform">
                      Ver Ficha <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {!loading && recentAssets.length === 0 && (
                  <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                          No hay activos registrados aún.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    vigente: { color: "bg-green-100 text-green-700 border-green-200", label: "Vigente", icon: CheckCircle2 },
    por_vencer: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Por Vencer", icon: AlertTriangle },
    vencido: { color: "bg-red-100 text-red-700 border-red-200", label: "Vencido", icon: AlertTriangle },
    clausurado: { color: "bg-gray-100 text-gray-600 border-gray-200", label: "Clausurado", icon: AlertOctagon },
  };

  const style = config[status] || config['vigente'];
  const Icon = style.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border gap-1.5 ${style.color}`}>
      <Icon size={12} /> {style.label}
    </span>
  );
}