// Enums matching backend
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ReminderType {
  IMMEDIATE_CONFIRMATION = 'IMMEDIATE_CONFIRMATION',
  TEN_DAYS_BEFORE = 'TEN_DAYS_BEFORE',
  ONE_TO_TWO_HOURS_BEFORE = 'ONE_TO_TWO_HOURS_BEFORE',
}

export enum ReminderStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  OTHER = 'OTHER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// DTOs matching backend
export interface Client {
  id: string;
  name: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface CreateClientRequest {
  name: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface UpdateClientRequest {
  name?: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  appointmentTime: string;
  notes?: string;
  status: AppointmentStatus;
}

export interface CreateAppointmentRequest {
  clientId: string;
  doctorId: string;
  appointmentTime: string;
  notes?: string;
  reminderRuleIds?: string[];
  customReminderTimes?: string[];
}

export interface UpdateAppointmentRequest {
  appointmentTime?: string;
  doctorId?: string;
  notes?: string;
  status?: AppointmentStatus;
  reminderRuleIds?: string[];
  customReminderTimes?: string[];
}

export interface ReminderScheduleInfo {
  reminderId: string;
  type: ReminderType;
  scheduledTime: string;
  status: ReminderStatus;
}

export interface CalendarAppointmentResponse {
  id: string;
  clientId: string;
  clientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  appointmentTime: string;
  notes?: string;
  status: AppointmentStatus;
  reminderSchedules: ReminderScheduleInfo[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface CreateDoctorRequest {
  name: string;
  specialization?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface Treatment {
  id: string;
  clientId: string;
  appointmentId?: string;
  totalAmount: number;
  description?: string;
  createdAt: string;
  payments: Payment[];
}

export interface CreateTreatmentRequest {
  clientId: string;
  appointmentId?: string;
  totalAmount: number;
  description?: string;
}

export interface Payment {
  id: string;
  treatmentId: string;
  amountPaid: number;
  paymentDate: string;
  method: PaymentMethod;
  staffName?: string;
}

export interface CreatePaymentRequest {
  treatmentId: string;
  amountPaid: number;
  paymentDate: string;
  method: PaymentMethod;
  staffName?: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  hoursBefore?: number;
  minutesBefore?: number;
  isInstant?: boolean;
  isCustom?: boolean;
  customTime?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CreateReminderRuleRequest {
  name: string;
  hoursBefore?: number;
  minutesBefore?: number;
  isInstant?: boolean;
  isCustom?: boolean;
  customTime?: string;
  isActive?: boolean;
}

export interface TestEmailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface NotificationLog {
  id: string;
  reminderId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  timestamp: string;
  recipient?: string;
  errorMessage?: string;
}

