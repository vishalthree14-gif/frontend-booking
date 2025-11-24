// API Configuration
// Centralized API base URLs from environment variables

const API_CONFIG = {
  USER_SERVICE: process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:5001',
  HOME_SERVICE: process.env.REACT_APP_HOME_SERVICE_URL || 'http://localhost:5002',
  PAYMENT_SERVICE: process.env.REACT_APP_PAYMENT_SERVICE_URL || 'http://localhost:5003',
};

// API Endpoints
export const API_ENDPOINTS = {
  // User Service
  USERS: {
    REGISTER: `${API_CONFIG.USER_SERVICE}/api/users/register`,
    LOGIN: `${API_CONFIG.USER_SERVICE}/api/users/login`,
    GOOGLE_LOGIN: `${API_CONFIG.USER_SERVICE}/api/users/google-login`,
    REFRESH: `${API_CONFIG.USER_SERVICE}/api/users/refresh`,
    PROFILE: `${API_CONFIG.USER_SERVICE}/api/users/profile`,
  },

  // Home Service
  MOVIES: {
    ALL: `${API_CONFIG.HOME_SERVICE}/api/movies`,
    FEATURED: `${API_CONFIG.HOME_SERVICE}/api/movies/featured`,
    UPCOMING: `${API_CONFIG.HOME_SERVICE}/api/movies/upcoming`,
    BY_ID: (id) => `${API_CONFIG.HOME_SERVICE}/api/movies/${id}`,
  },

  MALLS: {
    ALL: `${API_CONFIG.HOME_SERVICE}/api/malls`,
    BY_ID: (id) => `${API_CONFIG.HOME_SERVICE}/api/malls/${id}`,
  },

  SHOWS: {
    ALL: `${API_CONFIG.HOME_SERVICE}/api/shows`,
    BY_MALL_MOVIE: (mallId, movieId) =>
      `${API_CONFIG.HOME_SERVICE}/api/shows/by-mall-movie/${mallId}/${movieId}`,
    SEATS: (showId) => `${API_CONFIG.HOME_SERVICE}/api/shows/${showId}/seats`,
  },

  BOOKINGS: {
    CREATE: `${API_CONFIG.HOME_SERVICE}/api/bookings`,
    LOCK: `${API_CONFIG.HOME_SERVICE}/api/bookings/lock`,
    UNLOCK: `${API_CONFIG.HOME_SERVICE}/api/bookings/unlock`,
    USER_BOOKINGS: (userId) => `${API_CONFIG.HOME_SERVICE}/api/bookings/user/${userId}`,
  },

  // Payment Service
  PAYMENTS: {
    CREATE_ORDER: `${API_CONFIG.PAYMENT_SERVICE}/api/payments/create-order`,
    VERIFY: `${API_CONFIG.PAYMENT_SERVICE}/api/payments/verify`,
    STATUS: (orderId) => `${API_CONFIG.PAYMENT_SERVICE}/api/payments/status/${orderId}`,
    BY_BOOKING: (bookingId) => `${API_CONFIG.PAYMENT_SERVICE}/api/payments/booking/${bookingId}`,
  },
};

export default API_CONFIG;
