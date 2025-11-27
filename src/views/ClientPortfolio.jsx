import React, { useEffect, useState } from 'react';
import { Search, Plus, MapPin, Building2, ArrowRight, X, Loader2 } from 'lucide-react';

// ==============================================================================
// 🚨 INSTRUCCIONES PARA TU PROYECTO REAL (EN TU PC):
// 1. DESCOMENTA las líneas de abajo (Imports y const supabase...)
// 2. BORRA o COMENTA todo el bloque de "SIMULACIÓN DE DATOS" más abajo.
// ==============================================================================

/* import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
*/

// ==============================================================================
// 🎭 SIMULACIÓN DE DATOS (PARA QUE LA DEMO FUNCIONE AQUÍ SIN ERROR)
// ==============================================================================

// Usamos una variable global fuera del componente para que persista los cambios en la demo
let mockDB = [
  {
    id: 1,
    name: 'Edificio Torre Marina',
    address: 'Av. Perú 100, Viña del Mar',
    admin_name: 'Juan Pérez',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
    created_at: '2023-01-01'
  },
  {
    id: 2,
    name: 'Mall Plaza V',
    address: '14 Norte, Viña del Mar',
    admin_name: 'Gerencia Ops',
    image_url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?q=80&w=1000&auto=format&fit=crop',
    created_at: '2023-02-01'
  }
];

// Este "falso supabase" ahora SÍ guarda los datos en el array mockDB
const supabase = {
  from: () => ({
    select: () => ({
      order: async () => {
        await new Promise(r => setTimeout(r, 600)); // Simula red
        return { data: [...mockDB], error: null };
      }
    }),
    insert: async (rows) => {
      await new Promise(r => setTimeout(r, 800)); // Simula guardado
      // Aquí ocurre la magia: Agregamos el dato nuevo al array de mentira
      const newEntry = { 
        ...rows[0], 
        id: Math.random(), 
        created_at: new Date().toISOString() 
      };
      mockDB = [newEntry, ...mockDB]; // Lo ponemos al principio
      return { error: null };
    }
  })
};
// ==============================================================================


export default function ClientPortfolio({ onNavigate }) {
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    address: '',
    admin_name: '',
    contact_email: ''
  });

  // CARGAR DATOS
  async function fetchClients() {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  // CREAR CLIENTE
  const handleCreateClient = async (e) => {
    e.preventDefault();
    setCreating(true);

    const { error } = await supabase
      .from('clients')
      .insert([{
        name: newClient.name,
        address: newClient.address,
        admin_name: newClient.admin_name,
        contact_email: newClient.contact_email,
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
        status: 'active'
      }]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setShowModal(false);
      setNewClient({ name: '', address: '', admin_name: '', contact_email: '' });
      
      // RECARGAMOS LA LISTA PARA QUE APAREZCA EL NUEVO
      fetchClients();
    }
    setCreating(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative font-sans text-gray-900">
      
      {/* FONDO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
            src="https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-10"
            alt="Fondo Industrial"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/90 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cartera de Clientes</h1>
            <p className="text-gray-500 text-sm">Gestiona los edificios y plantas bajo tu certificación.</p>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} /> Nuevo Cliente
          </button>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="px-8 py-6">
          <div className="bg-white/90 backdrop-blur p-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 max-w-2xl">
            <Search className="text-gray-400 ml-2" size={20} />
            <input type="text" placeholder="Buscar edificio..." className="flex-1 bg-transparent outline-none text-sm text-gray-700" />
          </div>
        </div>

        {/* GRID DE TARJETAS */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          
          {loading && (
            <div className="flex justify-center items-center h-40 text-blue-600">
                <Loader2 className="animate-spin mr-2" /> Actualizando lista...
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <button 
                  onClick={() => setShowModal(true)}
                  className="border-2 border-dashed border-gray-300 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all bg-white/50 backdrop-blur-sm group"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 shadow-sm transition-colors">
                    <Plus size={28} />
                </div>
                <span className="font-bold text-sm">Registrar Nuevo Edificio</span>
              </button>

              {clients.map((client) => (
                <div key={client.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="h-40 relative overflow-hidden">
                    <img 
                      src={client.image_url} 
                      alt={client.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <h3 className="font-bold text-lg leading-tight shadow-black drop-shadow-md">{client.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-300 mt-1">
                        <MapPin size={12} /> {client.address}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-bold border border-blue-100 flex items-center gap-1">
                          <Building2 size={10} /> Ver Activos
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Administrador</p>
                          <p className="text-sm font-bold text-gray-700">{client.admin_name}</p>
                      </div>
                      <button 
                        onClick={() => onNavigate('dashboard')} 
                        className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 text-lg">Nuevo Edificio / Cliente</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Edificio</label>
                <input 
                  type="text" required placeholder="Ej: Torre Costanera"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
                <input 
                  type="text" required placeholder="Ej: Av. Apoquindo 4000"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newClient.address}
                  onChange={e => setNewClient({...newClient, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Administrador</label>
                  <input 
                    type="text" required placeholder="Nombre"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newClient.admin_name}
                    onChange={e => setNewClient({...newClient, admin_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" placeholder="contacto@..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newClient.contact_email}
                    onChange={e => setNewClient({...newClient, contact_email: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-lg font-bold text-gray-700 hover:bg-gray-100">Cancelar</button>
                <button type="submit" disabled={creating} className="flex-1 px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2">
                  {creating ? <Loader2 className="animate-spin" size={18} /> : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}