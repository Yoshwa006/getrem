import { useState, useEffect } from 'react';
import { appointmentsApi, clientsApi } from '../../services/api';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  Client,
  AppointmentStatus,
} from '../../types';
import './AppointmentForm.css';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AppointmentForm({
  appointment,
  onClose,
  onSuccess,
}: AppointmentFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    clientId: '',
    appointmentTime: '',
    notes: '',
  });
  const [status, setStatus] = useState<AppointmentStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
    if (appointment) {
      setFormData({
        clientId: appointment.clientId,
        appointmentTime: new Date(appointment.appointmentTime).toISOString().slice(0, 16),
        notes: appointment.notes || '',
      });
      setStatus(appointment.status);
    }
  }, [appointment]);

  const loadClients = async () => {
    try {
      const response = await clientsApi.getAll(0, 1000);
      setClients(response.content || []);
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (appointment) {
        const updateData: UpdateAppointmentRequest = {
          appointmentTime: formData.appointmentTime,
          notes: formData.notes,
          status: status || undefined,
        };
        await appointmentsApi.update(appointment.id, updateData);
      } else {
        await appointmentsApi.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.message || 'Failed to save appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{appointment ? 'Edit Appointment' : 'Create Appointment'}</h3>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="clientId">Client *</label>
            <select
              id="clientId"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              required
              disabled={!!appointment}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appointmentTime">Date & Time *</label>
            <input
              id="appointmentTime"
              type="datetime-local"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              required
            />
          </div>

          {appointment && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : appointment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

