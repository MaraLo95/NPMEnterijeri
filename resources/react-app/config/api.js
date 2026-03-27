// API Configuration - usklađeno sa routes/api.php
// Rute: Route::prefix('api')->group(routes/api.php)
//
// JAVNE:  POST /api/auth/login,  POST /api/auth/register
// ZAŠTIĆENE (auth:sanctum):
//   auth:      POST /api/auth/logout, GET /api/auth/me, ...
//   klijenti:  GET/POST /api/klijenti, GET/PUT/DELETE /api/klijenti/{id}
//   radnici:  GET/POST /api/radnici, GET/PUT/DELETE /api/radnici/{id}
//   projekti: GET/POST /api/projekti, GET/PUT/DELETE /api/projekti/{id}, PATCH /api/projekti/{id}/status
//   ponude:   GET/POST /api/ponude, ...
//   obracuni: GET/POST /api/obracuni, ...

const isViteDev = window.location.hostname === 'localhost' && window.location.port === '5173';
const API_BASE_URL = isViteDev
  ? 'http://localhost:8000/api'
  : '/api';

export const API = {
  baseUrl: API_BASE_URL,

  // Auth - Route::prefix('auth')
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    changePassword: `${API_BASE_URL}/auth/change-password`,
  },

  // Korisnik - Route::get('/user')
  user: `${API_BASE_URL}/user`,

  // Klijenti - Route::prefix('klijenti')
  klijenti: {
    list: `${API_BASE_URL}/klijenti`,
    create: `${API_BASE_URL}/klijenti`,
    get: (id) => `${API_BASE_URL}/klijenti/${id}`,
    update: (id) => `${API_BASE_URL}/klijenti/${id}`,
    delete: (id) => `${API_BASE_URL}/klijenti/${id}`,
    stats: (id) => `${API_BASE_URL}/klijenti/${id}/stats`,
  },

  // Cenovnik - Route::prefix('cenovnik')
  cenovnik: {
    list: `${API_BASE_URL}/cenovnik`,
    create: `${API_BASE_URL}/cenovnik`,
    bulkImport: `${API_BASE_URL}/cenovnik/bulk-import`,
    get: (id) => `${API_BASE_URL}/cenovnik/${id}`,
    update: (id) => `${API_BASE_URL}/cenovnik/${id}`,
    delete: (id) => `${API_BASE_URL}/cenovnik/${id}`,
  },

  // Obračuni - Route::prefix('obracuni')
  obracuni: {
    list: `${API_BASE_URL}/obracuni`,
    create: `${API_BASE_URL}/obracuni`,
    get: (id) => `${API_BASE_URL}/obracuni/${id}`,
    update: (id) => `${API_BASE_URL}/obracuni/${id}`,
    delete: (id) => `${API_BASE_URL}/obracuni/${id}`,
    status: (id) => `${API_BASE_URL}/obracuni/${id}/status`,
    calculateProfit: `${API_BASE_URL}/obracuni/calculate-profit`,
  },

  // Ponude - Route::prefix('ponude')
  ponude: {
    list: `${API_BASE_URL}/ponude`,
    create: `${API_BASE_URL}/ponude`,
    get: (id) => `${API_BASE_URL}/ponude/${id}`,
    update: (id) => `${API_BASE_URL}/ponude/${id}`,
    delete: (id) => `${API_BASE_URL}/ponude/${id}`,
    status: (id) => `${API_BASE_URL}/ponude/${id}/status`,
    pdf: (id) => `${API_BASE_URL}/ponude/${id}/pdf`,
  },

  // Radnici - Route::prefix('radnici')
  radnici: {
    list: `${API_BASE_URL}/radnici`,
    create: `${API_BASE_URL}/radnici`,
    get: (id) => `${API_BASE_URL}/radnici/${id}`,
    update: (id) => `${API_BASE_URL}/radnici/${id}`,
    delete: (id) => `${API_BASE_URL}/radnici/${id}`,
  },

  // Projekti - Route::prefix('projekti')
  projekti: {
    list: `${API_BASE_URL}/projekti`,
    create: `${API_BASE_URL}/projekti`,
    get: (id) => `${API_BASE_URL}/projekti/${id}`,
    update: (id) => `${API_BASE_URL}/projekti/${id}`,
    delete: (id) => `${API_BASE_URL}/projekti/${id}`,
    status: (id) => `${API_BASE_URL}/projekti/${id}/status`,
    updateFaza: (projekatId, fazaId) => `${API_BASE_URL}/projekti/${projekatId}/faze/${fazaId}`,
    addRadnik: (id) => `${API_BASE_URL}/projekti/${id}/radnici`,
    removeRadnik: (projekatId, radnikId) => `${API_BASE_URL}/projekti/${projekatId}/radnici/${radnikId}`,
    uploadSlika: (id) => `${API_BASE_URL}/projekti/${id}/slike`,
  },
};

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message 
        || (errorData.errors && Object.values(errorData.errors).flat().join(', '))
        || `HTTP ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.data = errorData;
      throw err;
    }

    return response.json();
  } catch (error) {
    console.error('API call failed:', url, error?.message, error);
    throw error;
  }
};

export default API;
