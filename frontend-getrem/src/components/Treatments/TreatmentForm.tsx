import { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Input, message, Space } from 'antd';
import { treatmentsApi, clientsApi, appointmentsApi } from '../../services/api';
import type { Client, Appointment, CreateTreatmentRequest } from '../../types';

const { TextArea } = Input;

interface TreatmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TreatmentForm({ onClose, onSuccess }: TreatmentFormProps) {
  const [form] = Form.useForm();
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      loadAppointments();
    } else {
      setAppointments([]);
    }
  }, [selectedClientId]);

  const loadClients = async () => {
    try {
      setLoadingData(true);
      const response = await clientsApi.getAll(0, 1000);
      setClients(response.content || []);
    } catch (err) {
      console.error('Failed to load clients', err);
      message.error('Failed to load clients');
    } finally {
      setLoadingData(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await appointmentsApi.getByClientId(selectedClientId);
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to load appointments', err);
    }
  };

  const handleSubmit = async (values: CreateTreatmentRequest) => {
    setLoading(true);
    try {
      await treatmentsApi.create({
        ...values,
        appointmentId: values.appointmentId || undefined,
      });
      onSuccess();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        message.error(errorMessages);
      } else {
        message.error(errorData?.message || 'Failed to create treatment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Treatment"
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="clientId"
          label="Client"
          rules={[{ required: true, message: 'Please select a client' }]}
        >
          <Select
            placeholder="Select Client"
            size="large"
            onChange={(value) => {
              setSelectedClientId(value);
              form.setFieldValue('appointmentId', undefined);
            }}
            loading={loadingData}
          >
            {clients.map((client) => (
              <Select.Option key={client.id} value={client.id}>
                {client.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="appointmentId"
          label="Appointment (Optional)"
        >
          <Select
            placeholder="No Appointment"
            size="large"
            disabled={!selectedClientId}
            allowClear
          >
            {appointments.map((apt) => (
              <Select.Option key={apt.id} value={apt.id}>
                {new Date(apt.appointmentTime).toLocaleString()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Total Amount"
          rules={[
            { required: true, message: 'Please enter total amount' },
            { type: 'number', min: 0, message: 'Amount must be positive' },
          ]}
        >
          <InputNumber
            placeholder="Enter total amount"
            style={{ width: '100%' }}
            size="large"
            min={0}
            step={0.01}
            prefix="₹"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            placeholder="Enter treatment description"
            rows={3}
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              className="ant-btn ant-btn-default"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ant-btn ant-btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
