import { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, message, Space } from 'antd';
import { doctorsApi } from '../../services/api';
import type { Doctor, CreateDoctorRequest } from '../../types';
import './DoctorForm.css';

interface DoctorFormProps {
  doctor?: Doctor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DoctorForm({ doctor, onClose, onSuccess }: DoctorFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        name: doctor.name || '',
        specialization: doctor.specialization || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        active: doctor.active !== false,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ active: true });
    }
  }, [doctor, form]);

  const handleSubmit = async (values: CreateDoctorRequest) => {
    setLoading(true);
    try {
      if (doctor) {
        await doctorsApi.update(doctor.id, values);
      } else {
        await doctorsApi.create(values);
      }
      onSuccess();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        message.error(errorMessages);
      } else {
        message.error(errorData?.message || 'Failed to save doctor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={doctor ? 'Edit Doctor' : 'Create Doctor'}
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
        className="doctor-form"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter doctor name' }]}
        >
          <Input placeholder="Enter doctor name" size="large" />
        </Form.Item>

        <Form.Item
          name="specialization"
          label="Specialization"
        >
          <Input placeholder="Enter specialization" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="Enter email address" size="large" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
        >
          <Input placeholder="Enter phone number" size="large" />
        </Form.Item>

        <Form.Item
          name="active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
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
              {loading ? 'Saving...' : doctor ? 'Update' : 'Create'}
            </button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

