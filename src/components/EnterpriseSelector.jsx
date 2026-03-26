import { useEffect, useState } from 'react';
import { enterpriseService } from '../services/enterpriseService';

export default function EnterpriseSelector({ selectedId, onSelect }) {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEnterprises = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await enterpriseService.getAll(0, 100, true);
        setEnterprises(data || []);
      } catch (err) {
        console.error('Error loading enterprises:', err);
        setError('Error cargando empresas');
      } finally {
        setLoading(false);
      }
    };
    loadEnterprises();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onSelect(value);
    
    // Guardar selección en localStorage para persistencia
    if (value) {
      localStorage.setItem('selectedEnterprise', value);
    }
  };

  if (loading) {
    return (
      <select className="field-input" disabled>
        <option>Cargando empresas...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select className="field-input" disabled>
        <option>{error}</option>
      </select>
    );
  }

  return (
    <select
      value={selectedId || ''}
      onChange={handleChange}
      className="field-input"
      title="Selecciona la empresa para filtrar licencias"
    >
      <option value="">Todas las empresas</option>
      {enterprises?.length > 0 ? (
        enterprises.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name} ({e.code})
          </option>
        ))
      ) : (
        <option disabled>No hay empresas disponibles</option>
      )}
    </select>
  );
}
