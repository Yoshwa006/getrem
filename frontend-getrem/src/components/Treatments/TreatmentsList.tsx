import { useState, useEffect } from 'react';
import { treatmentsApi } from '../../services/api';
import type { Treatment } from '../../types';
import TreatmentForm from './TreatmentForm';
import { format } from 'date-fns';
import './TreatmentsList.css';

export default function TreatmentsList() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadTreatments();
  }, [page]);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await treatmentsApi.getAll(page, 20);
      setTreatments(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load treatments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadTreatments();
  };

  const calculateTotalPaid = (treatment: Treatment) => {
    return (treatment.payments ?? []).reduce((sum, payment) => sum + payment.amountPaid, 0);
  };
  
  const calculateRemaining = (treatment: Treatment) => {
    return treatment.totalAmount - calculateTotalPaid(treatment);
  };


  if (loading && treatments.length === 0) {
    return <div className="loading">Loading treatments...</div>;
  }

  return (
    <div className="treatments-list">
      <div className="page-header">
        <h2>Treatments</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          + New Treatment
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <TreatmentForm onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Description</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {treatments.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No treatments found. Create your first treatment!
                </td>
              </tr>
            ) : (
              treatments.map((treatment) => {
                const totalPaid = calculateTotalPaid(treatment);
                const remaining = calculateRemaining(treatment);
                return (
                  <tr key={treatment.id}>
                    <td>{treatment.clientId}</td>
                    <td>{treatment.description || '-'}</td>
                    <td>₹{treatment.totalAmount.toFixed(2)}</td>
                    <td>₹{totalPaid.toFixed(2)}</td>
                    <td className={remaining > 0 ? 'remaining-amount' : 'paid-full'}>
                      ₹{remaining.toFixed(2)}
                    </td>
                    <td>{format(new Date(treatment.createdAt), 'MMM dd, yyyy')}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn btn-sm"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

