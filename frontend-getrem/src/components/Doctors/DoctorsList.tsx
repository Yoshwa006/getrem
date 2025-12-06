import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Tag, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { doctorsApi } from '../../services/api';
import type { Doctor } from '../../types';
import DoctorForm from './DoctorForm';
import './DoctorsList.css';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorsApi.getAll();
      setDoctors(response || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load doctors';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await doctorsApi.delete(id);
      message.success('Doctor deleted successfully');
      loadDoctors();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete doctor';
      message.error(errorMsg);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDoctor(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadDoctors();
    message.success(editingDoctor ? 'Doctor updated successfully' : 'Doctor created successfully');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Doctor, b: Doctor) => a.name.localeCompare(b.name),
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (specialization: string | undefined) => 
        specialization ? <Tag color="blue">{specialization}</Tag> : '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string | undefined) => email || '-',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | undefined) => phone || '-',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean | undefined) => (
        <Tag color={active !== false ? 'green' : 'red'}>
          {active !== false ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: any, record: Doctor) => (record.active !== false) === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Doctor) => (
        <Space size="small">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Doctor"
            description="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
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
    <div className="page-container">
      <div className="page-header">
        <h2>Doctors</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Add Doctor
        </Button>
      </div>

      {showForm && (
        <DoctorForm
          doctor={editingDoctor}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={doctors}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} doctors`,
            }}
            locale={{
              emptyText: 'No doctors found. Create your first doctor!',
            }}
          />
        </Spin>
      </Card>
    </div>
  );
}

