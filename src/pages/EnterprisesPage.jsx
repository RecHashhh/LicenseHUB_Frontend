import { useEffect, useState } from 'react';
import { enterpriseService } from '../services/enterpriseService';

export default function EnterprisesPage() {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    loadEnterprises();
  }, []);

  const loadEnterprises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await enterpriseService.getAll(0, 100);
      setEnterprises(data || []);
    } catch (err) {
      console.error('Error loading enterprises:', err);
      setError('Error cargando empresas');
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
        await enterpriseService.update(editingId, formData);
      } else {
        await enterpriseService.create(formData);
      }
      resetForm();
      loadEnterprises();
    } catch (err) {
      console.error('Error saving enterprise:', err);
      setError(err.response?.data?.detail || 'Error guardando empresa');
    }
  };

  const handleEdit = (enterprise) => {
    setFormData(enterprise);
    setEditingId(enterprise.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      try {
        setError(null);
        await enterpriseService.delete(id);
        loadEnterprises();
      } catch (err) {
        console.error('Error deleting enterprise:', err);
        setError(err.response?.data?.detail || 'Error eliminando empresa');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
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
        <div className="text-center">Cargando empresas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Empresas</h1>
          <p className="text-slate-600 mt-2">
            Administra los dominios y empresas del sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`action-btn-${showForm ? 'secondary' : 'primary'}`}
        >
          {showForm ? 'Cancelar' : '+ Nueva Empresa'}
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
            {editingId ? 'Editar Empresa' : 'Nueva Empresa'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: RIPCON"
                required
                className="field-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Ej: RIPCON"
                maxLength="20"
                required
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
              placeholder="Descripción de la empresa..."
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
              Empresa activa
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="action-btn-primary">
              {editingId ? 'Guardar Cambios' : 'Crear Empresa'}
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
      {enterprises.length === 0 ? (
        <div className="surface-panel p-12 text-center">
          <p className="text-slate-500">No hay empresas cargadas</p>
          <p className="text-slate-400 text-sm mt-2">
            Crea la primera empresa para comenzar
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enterprises.map((enterprise) => (
            <div
              key={enterprise.id}
              className="surface-panel p-6 flex justify-between items-start hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {enterprise.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-slate-200 text-slate-800 text-sm font-mono rounded">
                    {enterprise.code}
                  </span>
                  {enterprise.is_active ? (
                    <span className="status-chip-active">Activa</span>
                  ) : (
                    <span className="status-chip-inactive">Inactiva</span>
                  )}
                </div>
                {enterprise.description && (
                  <p className="text-slate-600 mt-2">{enterprise.description}</p>
                )}
                <div className="text-xs text-slate-400 mt-3">
                  Creado: {new Date(enterprise.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(enterprise)}
                  className="action-btn-secondary text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(enterprise.id)}
                  className="action-btn-danger text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
