import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { appointmentsApi } from '../../services/api';
import type { Appointment, AppointmentStatus } from '../../types';
import AppointmentFormAntd from './AppointmentFormAntd';
import { format } from 'date-fns';

const { Title } = Typography;

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadAppointments();
  }, [page]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentsApi.getAll(page, 20);
      setAppointments(response.content || []);
      setTotal(response.totalElements || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    try {
      await appointmentsApi.delete(id);
      loadAppointments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadAppointments();
  };

  const getStatusColor = (status: AppointmentStatus) => {
    const colors: Record<AppointmentStatus, string> = {
      SCHEDULED: 'blue',
      COMPLETED: 'green',
      CANCELLED: 'red',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (name: string, record: Appointment) => (
        <span>
          {name} {record.doctorSpecialization && <Tag color="blue">{record.doctorSpecialization}</Tag>}
        </span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      render: (time: string) => format(new Date(time), 'MMM dd, yyyy HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppointmentStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Appointment) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>Appointments</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          New Appointment
        </Button>
      </Space>

      {error && <div style={{ marginBottom: 16, color: 'red' }}>{error}</div>}

      <AppointmentFormAntd
        appointment={editingAppointment}
        visible={showForm}
        onCancel={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <Card>
        <Table
          columns={columns}
          dataSource={appointments}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page + 1,
            pageSize: 20,
            total,
            onChange: (newPage) => setPage(newPage - 1),
          }}
        />
      </Card>
    </div>
  );
}

