import { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, DatePicker, Input, message, Space } from 'antd';
import { paymentsApi, treatmentsApi } from '../../services/api';
import type { Treatment, CreatePaymentRequest } from '../../types';
import { PaymentMethod } from '../../types';
import dayjs from 'dayjs';

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentForm({ onClose, onSuccess }: PaymentFormProps) {
  const [form] = Form.useForm();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setLoadingData(true);
      const response = await treatmentsApi.getAll(0, 1000);
      setTreatments(response.content || []);
    } catch (err) {
      console.error('Failed to load treatments', err);
      message.error('Failed to load treatments');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: CreatePaymentRequest = {
        ...values,
        paymentDate: values.paymentDate.format('YYYY-MM-DD'),
      };
      await paymentsApi.create(payload);
      onSuccess();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        message.error(errorMessages);
      } else {
        message.error(errorData?.message || 'Failed to create payment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Payment"
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
        initialValues={{
          paymentDate: dayjs(),
          method: PaymentMethod.CASH,
        }}
      >
        <Form.Item
          name="treatmentId"
          label="Treatment"
          rules={[{ required: true, message: 'Please select a treatment' }]}
        >
          <Select
            placeholder="Select Treatment"
            size="large"
            loading={loadingData}
          >
            {treatments.map((treatment) => (
              <Select.Option key={treatment.id} value={treatment.id}>
                {treatment.description || 'Treatment'} - ₹{treatment.totalAmount.toFixed(2)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amountPaid"
          label="Amount Paid"
          rules={[
            { required: true, message: 'Please enter amount paid' },
            { type: 'number', min: 0, message: 'Amount must be positive' },
          ]}
        >
          <InputNumber
            placeholder="Enter amount paid"
            style={{ width: '100%' }}
            size="large"
            min={0}
            step={0.01}
            prefix="₹"
          />
        </Form.Item>

        <Space.Compact style={{ width: '100%' }}>
          <Form.Item
            name="paymentDate"
            label="Payment Date"
            rules={[{ required: true, message: 'Please select payment date' }]}
            style={{ flex: 1, marginRight: 12 }}
          >
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            name="method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
            style={{ flex: 1 }}
          >
            <Select size="large">
              <Select.Option value={PaymentMethod.CASH}>Cash</Select.Option>
              <Select.Option value={PaymentMethod.CARD}>Card</Select.Option>
              <Select.Option value={PaymentMethod.UPI}>UPI</Select.Option>
              <Select.Option value={PaymentMethod.OTHER}>Other</Select.Option>
            </Select>
          </Form.Item>
        </Space.Compact>

        <Form.Item
          name="staffName"
          label="Staff Name"
        >
          <Input placeholder="Enter staff name" size="large" />
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
