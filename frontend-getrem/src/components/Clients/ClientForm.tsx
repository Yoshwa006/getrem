import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { clientsApi } from '../../services/api';
import type { Client, CreateClientRequest, UpdateClientRequest, Gender } from '../../types';
import './ClientForm.css';

const { TextArea } = Input;

interface ClientFormProps {
  client?: Client | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClientForm({ client, onClose, onSuccess }: ClientFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      form.setFieldsValue({
        name: client.name || '',
        age: client.age,
        gender: client.gender,
        phone: client.phone || '',
        email: client.email || '',
        notes: client.notes || '',
      });
    } else {
      form.resetFields();
    }
  }, [client, form]);

  const handleSubmit = async (values: CreateClientRequest) => {
    setLoading(true);
    try {
      if (client) {
        await clientsApi.update(client.id, values as UpdateClientRequest);
      } else {
        await clientsApi.create(values);
      }
      onSuccess();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        message.error(errorMessages);
      } else {
        message.error(errorData?.message || 'Failed to save client');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={client ? 'Edit Client' : 'Create Client'}
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
        className="client-form"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter client name' }]}
        >
          <Input placeholder="Enter client name" size="large" />
        </Form.Item>

        <Space.Compact style={{ width: '100%' }}>
          <Form.Item
            name="age"
            label="Age"
            style={{ flex: 1, marginRight: 12 }}
          >
            <InputNumber
              placeholder="Age"
              min={0}
              max={150}
              style={{ width: '100%' }}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            style={{ flex: 1 }}
          >
            <Select placeholder="Select Gender" size="large">
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Form.Item>
        </Space.Compact>

        <Form.Item
          name="phone"
          label="Phone"
        >
          <Input placeholder="Enter phone number" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="Enter email address" size="large" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea
            placeholder="Enter any additional notes"
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
              {loading ? 'Saving...' : client ? 'Update' : 'Create'}
            </button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
