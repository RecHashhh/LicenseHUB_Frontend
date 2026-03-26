import api from './api';

export const softwareService = {
  /**
   * Obtener todos los softwares
   */
  getAll: (skip = 0, limit = 100, isActive = null) => {
    const params = new URLSearchParams();
    params.append('skip', skip);
    params.append('limit', limit);
    if (isActive !== null) {
      params.append('is_active', isActive);
    }
    return api
      .get(`/software/?${params.toString()}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error fetching software:', err);
        throw err;
      });
  },

  /**
   * Obtener un software por ID
   */
  getById: (id) =>
    api
      .get(`/software/${id}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error fetching software:', err);
        throw err;
      }),

  /**
   * Crear nuevo software
   */
  create: (data) =>
    api
      .post('/software/', data)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error creating software:', err);
        throw err;
      }),

  /**
   * Actualizar software
   */
  update: (id, data) =>
    api
      .put(`/software/${id}`, data)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error updating software:', err);
        throw err;
      }),

  /**
   * Eliminar software
   */
  delete: (id) =>
    api
      .delete(`/software/${id}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error('Error deleting software:', err);
        throw err;
      }),
};

// Export legacy function for compatibility
export const getSoftware = async () => {
  return softwareService.getAll();
};
