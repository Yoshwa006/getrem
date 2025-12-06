import { useState, useEffect } from 'react';
import { Table, Button, Card, message, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { treatmentsApi } from '../../services/api';
import type { Treatment } from '../../types';
import TreatmentForm from './TreatmentForm';
import { format } from 'date-fns';

const { Text } = Typography;

export default function TreatmentsList() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadTreatments();
  }, [page]);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      const response = await treatmentsApi.getAll(page - 1, pageSize);
      setTreatments(response.content || []);
      setTotal(response.totalElements || 0);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load treatments';
      message.error(errorMsg);
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
    message.success('Treatment created successfully');
  };

  const calculateTotalPaid = (treatment: Treatment) => {
    return (treatment.payments ?? []).reduce((sum, payment) => sum + payment.amountPaid, 0);
  };
  
  const calculateRemaining = (treatment: Treatment) => {
    return treatment.totalAmount - calculateTotalPaid(treatment);
  };

  const columns = [
    {
      title: 'Client ID',
      dataIndex: 'clientId',
      key: 'clientId',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => desc || '-',
      ellipsis: true,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <Text strong>₹{amount.toFixed(2)}</Text>
      ),
      sorter: (a: Treatment, b: Treatment) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Paid',
      key: 'paid',
      render: (_: any, record: Treatment) => {
        const paid = calculateTotalPaid(record);
        return <Text>₹{paid.toFixed(2)}</Text>;
      },
    },
    {
      title: 'Remaining',
      key: 'remaining',
      render: (_: any, record: Treatment) => {
        const remaining = calculateRemaining(record);
        return (
          <Tag color={remaining > 0 ? 'orange' : 'green'}>
            ₹{remaining.toFixed(2)}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
      sorter: (a: Treatment, b: Treatment) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Treatments</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          New Treatment
        </Button>
      </div>

      {showForm && (
        <TreatmentForm onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}

      <Card>
        <Table
          columns={columns}
          dataSource={treatments}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} treatments`,
          }}
          locale={{
            emptyText: 'No treatments found. Create your first treatment!',
          }}
        />
      </Card>
    </div>
  );
}
