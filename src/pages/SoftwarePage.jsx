import { useEffect, useState } from 'react';
import { softwareService } from '../services/softwareService';

export default function SoftwarePage() {
  const [softwares, setSoftwares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    vendor: 'Autodesk',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    loadSoftwares();
  }, []);

  const loadSoftwares = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await softwareService.getAll();
      setSoftwares(data || []);
    } catch (err) {
      console.error('Error loading softwares:', err);
      setError('Error cargando softwares');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await softwareService.update(editingId, formData);
      } else {
        await softwareService.create(formData);
      }
      resetForm();
      loadSoftwares();
    } catch (err) {
      console.error('Error saving software:', err);
      setError(err.response?.data?.detail || 'Error guardando software');
    }
  };

  const handleEdit = (software) => {
    setFormData(software);
    setEditingId(software.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este software?')) {
      try {
        setError(null);
        await softwareService.delete(id);
        loadSoftwares();
      } catch (err) {
        console.error('Error deleting software:', err);
        setError(err.response?.data?.detail || 'Error eliminando software');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      vendor: 'Autodesk',
      description: '',
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">Cargando software...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Software/Paquetes</h1>
          <p className="text-slate-600 mt-2">
            Administra los tipos de software y paquetes de licencias disponibles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`action-btn-${showForm ? 'secondary' : 'primary'}`}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Software'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="surface-panel p-4 border-l-4 border-rose-500 bg-rose-50">
          <p className="text-rose-800 font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="surface-panel p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {editingId ? 'Editar Software' : 'Nuevo Software/Paquete'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del Software/Paquete *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Estudiantil Autodesk, Synchro, Bluebeam"
                required
                className="field-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Proveedor
              </label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                placeholder="Ej: Autodesk, Synchro, Adobe"
                className="field-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción del software o qué incluye este paquete..."
              rows="3"
              className="field-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="is_active" className="text-sm text-slate-700">
              Software activo y disponible
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="action-btn-primary">
              {editingId ? 'Guardar Cambios' : 'Crear Software'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="action-btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {softwares.length === 0 ? (
        <div className="surface-panel p-12 text-center">
          <p className="text-slate-500">No hay software cargado</p>
          <p className="text-slate-400 text-sm mt-2">
            Crea el primer software/paquete para comenzar
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {softwares.map((software) => (
            <div
              key={software.id}
              className="surface-panel p-6 flex justify-between items-start hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {software.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-slate-200 text-slate-800 text-sm font-mono rounded">
                    {software.vendor}
                  </span>
                  {software.is_active ? (
                    <span className="status-chip-active">Activo</span>
                  ) : (
                    <span className="status-chip-inactive">Inactivo</span>
                  )}
                </div>
                {software.description && (
                  <p className="text-slate-600 mt-2">{software.description}</p>
                )}
                <div className="text-xs text-slate-400 mt-3">
                  Creado: {new Date(software.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(software)}
                  className="action-btn-secondary text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(software.id)}
                  className="action-btn-danger text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="surface-panel p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Ejemplos de Software/Paquetes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ <strong>Estudiantil Autodesk</strong> - AutoCAD, Revit, Navisworks, Civil 3D</li>
          <li>✅ <strong>Synchro</strong> - Software de planificación de proyectos</li>
          <li>✅ <strong>Bluebeam</strong> - Herramientas de gestión de documentos</li>
          <li>✅ <strong>Microsoft Office 365</strong> - Suite de herramientas ofimáticas</li>
          <li>✅ Cualquier otro software que necesites manejar</li>
        </ul>
      </div>
    </div>
  );
}
