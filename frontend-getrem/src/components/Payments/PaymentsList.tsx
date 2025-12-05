import { useState, useEffect } from 'react';
import { paymentsApi } from '../../services/api';
import type { Payment } from '../../types';
import PaymentForm from './PaymentForm';
import { format } from 'date-fns';
import './PaymentsList.css';

export default function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadPayments();
  }, [page]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentsApi.getAll(page, 20);
      setPayments(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payments');
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
    loadPayments();
  };

  if (loading && payments.length === 0) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="payments-list">
      <div className="page-header">
        <h2>Payments</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          + New Payment
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && <PaymentForm onClose={handleFormClose} onSuccess={handleFormSuccess} />}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Treatment ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Staff</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No payments found. Create your first payment!
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.treatmentId}</td>
                  <td>₹{payment.amountPaid.toFixed(2)}</td>
                  <td>{payment.method}</td>
                  <td>{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</td>
                  <td>{payment.staffName || '-'}</td>
                </tr>
              ))
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

