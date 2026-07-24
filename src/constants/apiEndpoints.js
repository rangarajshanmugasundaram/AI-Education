export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login/',
    REGISTER: '/api/register/',
    FORGOT_PASSWORD: '/api/forgot-password/',
    RESET_PASSWORD: '/api/reset-password/',
  },
  CHAT: {
    SESSION: (sessionId) => `/api/chat/session/${sessionId}`,
    SEND: '/api/chat/send',
  },
  WHITEBOARD: {
    DETAIL: (sessionId) => `/api/whiteboard/${sessionId}/`,
    SAVE: '/api/whiteboard/save/',
  },
  ATTENDANCE: {
    SESSION: (session) => `/api/attendance/session/${session}`,
    REPORT: (session) => `/api/attendance/report/${session}`,
    UPDATE: '/api/attendance/update',
  },
  NOTIFICATIONS: {
    MY: '/api/notifications/my/',
    ALL: '/api/notifications/',
    CREATE: '/api/notifications/create/',
  },
};