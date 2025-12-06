import { useState, useEffect } from 'react';
import { paymentsApi, treatmentsApi } from '../../services/api';
import type { Treatment, CreatePaymentRequest } from '../../types';
import { PaymentMethod } from '../../types';

import './PaymentForm.css';

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentForm({ onClose, onSuccess }: PaymentFormProps) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [formData, setFormData] = useState<CreatePaymentRequest>({
    treatmentId: '',
    amountPaid: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    method: PaymentMethod.CASH,
    staffName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      const response = await treatmentsApi.getAll(0, 1000);
      setTreatments(response.content || []);
    } catch (err) {
      console.error('Failed to load treatments', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await paymentsApi.create(formData);
      onSuccess();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.message || 'Failed to create payment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Payment</h3>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="treatmentId">Treatment *</label>
            <select
              id="treatmentId"
              value={formData.treatmentId}
              onChange={(e) => setFormData({ ...formData, treatmentId: e.target.value })}
              required
            >
              <option value="">Select Treatment</option>
              {treatments.map((treatment) => (
                <option key={treatment.id} value={treatment.id}>
                  {treatment.description || 'Treatment'} - ₹{treatment.totalAmount.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amountPaid">Amount Paid *</label>
            <input
              id="amountPaid"
              type="number"
              step="0.01"
              min="0"
              value={formData.amountPaid}
              onChange={(e) =>
                setFormData({ ...formData, amountPaid: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paymentDate">Payment Date *</label>
              <input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="method">Payment Method *</label>
              <select
                id="method"
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value as PaymentMethod })
                }
                required
              >
                <option value={PaymentMethod.CASH}>Cash</option>
                <option value={PaymentMethod.CARD}>Card</option>
                <option value={PaymentMethod.UPI}>UPI</option>
                <option value={PaymentMethod.OTHER}>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="staffName">Staff Name</label>
            <input
              id="staffName"
              type="text"
              value={formData.staffName}
              onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
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

