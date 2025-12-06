import { useState, useEffect } from 'react';
import { Table, Button, Card, message, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { paymentsApi } from '../../services/api';
import type { Payment } from '../../types';
import PaymentForm from './PaymentForm';
import { format } from 'date-fns';

const { Text } = Typography;

export default function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadPayments();
  }, [page]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentsApi.getAll(page - 1, pageSize);
      setPayments(response.content || []);
      setTotal(response.totalElements || 0);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load payments';
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
    loadPayments();
    message.success('Payment created successfully');
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      CASH: 'green',
      CARD: 'blue',
      UPI: 'purple',
      OTHER: 'default',
    };
    return colors[method] || 'default';
  };

  const columns = [
    {
      title: 'Treatment ID',
      dataIndex: 'treatmentId',
      key: 'treatmentId',
    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (amount: number) => (
        <Text strong>₹{amount.toFixed(2)}</Text>
      ),
      sorter: (a: Payment, b: Payment) => a.amountPaid - b.amountPaid,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => (
        <Tag color={getMethodColor(method)}>{method}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
      sorter: (a: Payment, b: Payment) => 
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
    },
    {
      title: 'Staff',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (name: string) => name || '-',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Payments</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          New Payment
        </Button>
      </div>

      {showForm && <PaymentForm onClose={handleFormClose} onSuccess={handleFormSuccess} />}

      <Card>
        <Table
          columns={columns}
          dataSource={payments}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} payments`,
          }}
          locale={{
            emptyText: 'No payments found. Create your first payment!',
          }}
        />
      </Card>
    </div>
  );
}
