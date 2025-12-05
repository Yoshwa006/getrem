import { useState } from 'react';
import { Card, Form, Input, Button, message, Space, Typography } from 'antd';
import { emailApi } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

export default function EmailTestPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await emailApi.sendTest({
        to: values.to,
        subject: values.subject,
        body: values.body,
      });
      message.success('Test email sent successfully!');
      form.resetFields();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to send test email';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Test Email</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="to"
            label="To Email"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="recipient@example.com" />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input placeholder="Test Email Subject" />
          </Form.Item>

          <Form.Item
            name="body"
            label="Body"
            rules={[{ required: true, message: 'Please enter email body' }]}
          >
            <TextArea rows={6} placeholder="Email body content..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Send Test Email
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

