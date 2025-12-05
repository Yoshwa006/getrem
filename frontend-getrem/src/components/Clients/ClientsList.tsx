import { useState, useEffect } from 'react';
import { clientsApi } from '../../services/api';
import type { Client } from '../../types';
import ClientForm from './ClientForm';
import './ClientsList.css';

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadClients();
  }, [page]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.getAll(page, 20);
      setClients(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }
    try {
      await clientsApi.delete(id);
      loadClients();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete client');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadClients();
  };

  if (loading && clients.length === 0) {
    return <div className="loading">Loading clients...</div>;
  }

  return (
    <div className="clients-list">
      <div className="page-header">
        <h2>Clients</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          + Add Client
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <ClientForm
          client={editingClient}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No clients found. Create your first client!
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.age || '-'}</td>
                  <td>{client.gender || '-'}</td>
                  <td>{client.phone || '-'}</td>
                  <td>{client.email || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(client)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
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

