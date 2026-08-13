export const API_ENDPOINTS = {
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
  },

  USERS: {
    LIST_CREATE: '/api/users/',
    DETAIL: (id) => `/api/users/${id}/`,
    TOGGLE_STATUS: (id) => `/api/users/${id}/toggle-status/`,
    RESET_PASSWORD: (id) => `/api/users/${id}/reset-password/`,
  },

  COURSES: {
    LIST_CREATE: '/api/courses/',
    DETAIL: (id) => `/api/courses/${id}/`,
    ASSIGN_TRAINER: (id) => `/api/courses/${id}/assign-trainer/`,
    ARCHIVE: (id) => `/api/courses/${id}/archive/`,
    STATS: (id) => id ? `/api/courses/${id}/stats/` : '/api/courses/stats/',
  },

  BATCHES: {
    LIST_CREATE: '/api/batches/',
    DETAIL: (id) => `/api/batches/${id}/`,
    ALLOCATE_STUDENTS: (id) => `/api/batches/${id}/allocate-students/`,
    ALLOCATE_TRAINER: (id) => `/api/batches/${id}/allocate-trainer/`,
    STATS: (id) => id ? `/api/batches/${id}/stats/` : '/api/batches/stats/',
  },

  LIVE_MONITORING: {
    SESSIONS: '/api/classroom/live-monitoring/',
    STATS: (sessionId) => sessionId ? `/api/classroom/live-monitoring/${sessionId}/stats/` : '/api/classroom/live-monitoring/stats/',
    ATTENDANCE_SUMMARY: (sessionId) => `/api/classroom/live-monitoring/${sessionId}/attendance-summary/`,
    FORCE_END: (sessionId) => `/api/classroom/live-monitoring/${sessionId}/force-end/`,
  },

  EXAMS: {
    LIST_CREATE: '/api/exams/',
    DETAIL: (id) => `/api/exams/${id}/`,
    PUBLISH_TOGGLE: (id) => `/api/exams/${id}/publish/`,
    SUBMIT: (id) => `/api/exams/${id}/submit/`,
    RESULTS: (id) => `/api/exams/${id}/results/`,
    ANALYTICS: (id) => `/api/exams/${id}/analytics/`,
  },

  ASSIGNMENTS: {
    LIST_CREATE: '/api/assignments/',
    DETAIL: (id) => `/api/assignments/${id}/`,
    STATUS_TOGGLE: (id) => `/api/assignments/${id}/status/`,
    SUBMIT: (id) => `/api/assignments/${id}/submit/`,
    SUBMISSIONS_ROSTER: (id) => `/api/assignments/${id}/submissions/`,
    GRADE_SUBMISSION: (submissionId) => `/api/assignments/submissions/${submissionId}/grade/`,
    ANALYTICS: (id) => `/api/assignments/${id}/analytics/`,
  },

  CERTIFICATES: {
    LIST_CREATE: '/api/certificates/',
    VERIFY: '/api/certificates/verify/',
    DOWNLOAD: (certId) => `/api/certificates/${certId}/download/`,
  },

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
    CREATE: '/api/notifications/',
  },
  FEEDBACK: {
    SUBMIT: '/api/feedback/submit/',
    SESSION: (sessionId) => `/api/feedback/session/${sessionId}/`,
    TRAINER: (trainerId) => `/api/feedback/trainer/${trainerId}/`,
  },
  RECORDINGS: {
    LIST_CREATE: '/api/recordings/',
    DETAIL: (id) => `/api/recordings/${id}/`,
    UPDATE_STATUS: (id) => `/api/recordings/${id}/update-status/`,
    PLAYBACK_TOKEN: (id) => `/api/recordings/${id}/playback-token/`,
    ANALYTICS: (id) => `/api/recordings/${id}/analytics/`,
    MOST_VIEWED: '/api/recordings/most-viewed/',
  }
};