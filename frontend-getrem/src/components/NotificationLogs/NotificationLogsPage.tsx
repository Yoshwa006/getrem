import { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { notificationLogsApi } from '../../services/api';
import type { NotificationLog, NotificationChannel, NotificationStatus } from '../../types';
import { format } from 'date-fns';

const { Title } = Typography;

export default function NotificationLogsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await notificationLogsApi.getAll(page, 20);
      setLogs(response.content || []);
      setTotal(response.totalElements || 0);
    } catch (err: any) {
      console.error('Failed to load notification logs', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss'),
      sorter: true,
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: NotificationChannel) => {
        const colors: Record<NotificationChannel, string> = {
          EMAIL: 'blue',
          SMS: 'green',
          WHATSAPP: 'purple',
        };
        return <Tag color={colors[channel]}>{channel}</Tag>;
      },
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: NotificationStatus) => {
        const colors: Record<NotificationStatus, string> = {
          SENT: 'success',
          DELIVERED: 'success',
          PENDING: 'processing',
          FAILED: 'error',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Reminder ID',
      dataIndex: 'reminderId',
      key: 'reminderId',
      render: (id: string) => id.substring(0, 8) + '...',
    },
    {
      title: 'Error',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (error: string) => error ? <Tag color="red">{error}</Tag> : '-',
    },
  ];

  return (
    <div>
      <Title level={2}>Notification Logs</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={logs}
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

