import axios from 'axios';
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  CalendarAppointmentResponse,
  Treatment,
  CreateTreatmentRequest,
  Payment,
  CreatePaymentRequest,
  ReminderRule,
  CreateReminderRuleRequest,
  TestEmailRequest,
  NotificationLog,
  Doctor,
  CreateDoctorRequest,
} from '../types';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Clients API
export const clientsApi = {
  getAll: async (page: number = 0, size: number = 20) => {
    const response = await api.get(`/clients?page=${page}&size=${size}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  create: async (data: CreateClientRequest) => {
    const response = await api.post('/clients', data);
    return response.data;
  },
  update: async (id: string, data: UpdateClientRequest) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/clients/${id}`);
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async (page: number = 0, size: number = 20) => {
    const response = await api.get(`/appointments?page=${page}&size=${size}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  getByClientId: async (clientId: string) => {
    const response = await api.get(`/appointments/client/${clientId}`);
    return response.data;
  },
  create: async (data: CreateAppointmentRequest) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  update: async (id: string, data: UpdateAppointmentRequest) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/appointments/${id}`);
  },
  getForMonth: async (year: number, month: number) => {
    const response = await api.get(`/appointments/calendar/month?year=${year}&month=${month}`);
    return response.data;
  },
  getForWeek: async (startDate: string) => {
    const response = await api.get(`/appointments/calendar/week?startDate=${startDate}`);
    return response.data;
  },
  getForDay: async (date: string) => {
    const response = await api.get(`/appointments/calendar/day?date=${date}`);
    return response.data;
  },
  getForDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get(`/appointments/calendar/range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
  getUpcoming: async () => {
    const response = await api.get('/appointments/calendar/upcoming');
    return response.data;
  },
};

// Treatments API
export const treatmentsApi = {
  getAll: async (page: number = 0, size: number = 20) => {
    const response = await api.get(`/treatments?page=${page}&size=${size}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/treatments/${id}`);
    return response.data;
  },
  getByClientId: async (clientId: string) => {
    const response = await api.get(`/treatments/client/${clientId}`);
    return response.data;
  },
  getByAppointmentId: async (appointmentId: string) => {
    const response = await api.get(`/treatments/appointment/${appointmentId}`);
    return response.data;
  },
  create: async (data: CreateTreatmentRequest) => {
    const response = await api.post('/treatments', data);
    return response.data;
  },
};

// Payments API
export const paymentsApi = {
  getAll: async (page: number = 0, size: number = 20) => {
    const response = await api.get(`/payments?page=${page}&size=${size}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  getByTreatmentId: async (treatmentId: string) => {
    const response = await api.get(`/payments/treatment/${treatmentId}`);
    return response.data;
  },
  create: async (data: CreatePaymentRequest) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
};

// Reminder Rules API
export const reminderRulesApi = {
  getAll: async (page: number = 0, size: number = 20) => {
    const response = await api.get(`/reminder-rules?page=${page}&size=${size}`);
    return response.data;
  },
  getActive: async () => {
    const response = await api.get('/reminder-rules/active');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/reminder-rules/${id}`);
    return response.data;
  },
  create: async (data: CreateReminderRuleRequest) => {
    const response = await api.post('/reminder-rules', data);
    return response.data;
  },
  update: async (id: string, data: CreateReminderRuleRequest) => {
    const response = await api.put(`/reminder-rules/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/reminder-rules/${id}`);
  },
};

// Email API
export const emailApi = {
  sendTest: async (data: TestEmailRequest) => {
    const response = await api.post('/email/test', data);
    return response.data;
  },
};

// Notification Logs API
export const notificationLogsApi = {
  getAll: async (page: number = 0, size: number = 20) => {
    const response = await api.get(`/notification-logs?page=${page}&size=${size}`);
    return response.data;
  },
  getByAppointmentId: async (appointmentId: string) => {
    const response = await api.get(`/notification-logs/appointment/${appointmentId}`);
    return response.data;
  },
  getByReminderId: async (reminderId: string) => {
    const response = await api.get(`/notification-logs/reminder/${reminderId}`);
    return response.data;
  },
};

// Doctors API
export const doctorsApi = {
  getAll: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },
  getActive: async () => {
    const response = await api.get('/doctors/active');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  create: async (data: CreateDoctorRequest) => {
    const response = await api.post('/doctors', data);
    return response.data;
  },
  update: async (id: string, data: CreateDoctorRequest) => {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/doctors/${id}`);
  },
  checkAvailability: async (doctorId: string, appointmentTime: string, excludeAppointmentId?: string) => {
    const params = new URLSearchParams({ appointmentTime });
    if (excludeAppointmentId) {
      params.append('excludeAppointmentId', excludeAppointmentId);
    }
    const response = await api.get(`/doctors/${doctorId}/availability?${params.toString()}`);
    return response.data;
  },
};

export default api;

