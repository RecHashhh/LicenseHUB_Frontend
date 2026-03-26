import api from './api';

export const enterpriseService = {
  /**
   * Obtener todas las empresas
   */
  getAll: (skip = 0, limit = 100, isActive = null) => {
    const params = new URLSearchParams();
    params.append('skip', skip);
    params.append('limit', limit);
    if (isActive !== null) {
      params.append('is_active', isActive);
    }
    return api
      .get(`/enterprises/?${params.toString()}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error fetching enterprises:', err);
        throw err;
      });
  },

  /**
   * Obtener una empresa por ID
   */
  getById: (id) =>
    api
      .get(`/enterprises/${id}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error fetching enterprise:', err);
        throw err;
      }),

  /**
   * Crear una nueva empresa
   */
  create: (data) =>
    api
      .post('/enterprises/', data)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error creating enterprise:', err);
        throw err;
      }),

  /**
   * Actualizar una empresa
   */
  update: (id, data) =>
    api
      .put(`/enterprises/${id}`, data)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error updating enterprise:', err);
        throw err;
      }),

  /**
   * Eliminar una empresa
   */
  delete: (id) =>
    api
      .delete(`/enterprises/${id}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error deleting enterprise:', err);
        throw err;
      }),
};
