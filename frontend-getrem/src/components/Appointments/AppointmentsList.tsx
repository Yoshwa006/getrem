import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Card, 
  Typography, 
  message, 
  Popconfirm,
  Empty,
  Badge
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { appointmentsApi } from '../../services/api';
import type { Appointment, AppointmentStatus } from '../../types';
import AppointmentFormAntd from './AppointmentFormAntd';
import { format } from 'date-fns';

const { Title, Text } = Typography;

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
      message.error('Failed to load appointments');
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
    try {
      await appointmentsApi.delete(id);
      message.success('Appointment deleted successfully');
      loadAppointments();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete appointment';
      message.error(errorMessage);
      console.error('Failed to delete appointment', err);
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

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig: Record<AppointmentStatus, { color: string; text: string }> = {
      SCHEDULED: { color: 'processing', text: 'Scheduled' },
      COMPLETED: { color: 'success', text: 'Completed' },
      CANCELLED: { color: 'error', text: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Badge status={config.color as any} text={config.text} />;
  };

  const columns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (name: string, record: Appointment) => (
        <Space>
          <Text>{name}</Text>
          {record.doctorSpecialization && (
            <Tag color="blue" style={{ margin: 0 }}>{record.doctorSpecialization}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      render: (time: string) => (
        <Space>
          <CalendarOutlined />
          <Text>{format(new Date(time), 'MMM dd, yyyy HH:mm')}</Text>
        </Space>
      ),
      sorter: (a: Appointment, b: Appointment) => 
        new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppointmentStatus) => getStatusBadge(status),
      filters: [
        { text: 'Scheduled', value: 'SCHEDULED' },
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'Cancelled', value: 'CANCELLED' },
      ],
      onFilter: (value: any, record: Appointment) => record.status === value,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes ? <Text type="secondary">{notes}</Text> : <Text type="secondary" italic>-</Text>,
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: Appointment) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            type="primary"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Appointment"
            description="Are you sure you want to delete this appointment? This will also cancel all associated reminders."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarOutlined />
          Appointments
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="large"
          style={{ 
            height: '40px',
            borderRadius: '6px',
            fontWeight: 500
          }}
        >
          New Appointment
        </Button>
      </div>

      {error && (
        <Card 
          style={{ 
            marginBottom: 16, 
            borderColor: '#ff4d4f',
            borderRadius: '8px'
          }}
        >
          <Text type="danger">{error}</Text>
        </Card>
      )}

      <AppointmentFormAntd
        appointment={editingAppointment}
        visible={showForm}
        onCancel={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <Card 
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Table
          columns={columns}
          dataSource={appointments}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            current: page + 1,
            pageSize: 20,
            total,
            onChange: (newPage) => setPage(newPage - 1),
            showSizeChanger: false,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} appointments`,
            style: { marginTop: '16px' }
          }}
          locale={{
            emptyText: (
              <Empty
                description="No appointments found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
        />
      </Card>
    </div>
  );
}
