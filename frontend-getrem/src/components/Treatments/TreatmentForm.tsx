import { useState, useEffect } from 'react';
import { treatmentsApi, clientsApi, appointmentsApi } from '../../services/api';
import type { Client, Appointment, CreateTreatmentRequest } from '../../types';
import './TreatmentForm.css';

interface TreatmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TreatmentForm({ onClose, onSuccess }: TreatmentFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [formData, setFormData] = useState<CreateTreatmentRequest>({
    clientId: '',
    appointmentId: undefined,
    totalAmount: 0,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (formData.clientId) {
      loadAppointments();
    }
  }, [formData.clientId]);

  const loadClients = async () => {
    try {
      const response = await clientsApi.getAll(0, 1000);
      setClients(response.content || []);
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await appointmentsApi.getByClientId(formData.clientId);
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to load appointments', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await treatmentsApi.create({
        ...formData,
        appointmentId: formData.appointmentId || undefined,
      });
      onSuccess();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.message || 'Failed to create treatment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Treatment</h3>
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
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value, appointmentId: undefined })}
              required
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
            <label htmlFor="appointmentId">Appointment (Optional)</label>
            <select
              id="appointmentId"
              value={formData.appointmentId || ''}
              onChange={(e) =>
                setFormData({ ...formData, appointmentId: e.target.value || undefined })
              }
              disabled={!formData.clientId}
            >
              <option value="">No Appointment</option>
              {appointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {new Date(apt.appointmentTime).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="totalAmount">Total Amount *</label>
            <input
              id="totalAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.totalAmount}
              onChange={(e) =>
                setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

