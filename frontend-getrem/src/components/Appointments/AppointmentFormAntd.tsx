import { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Select, 
  DatePicker, 
  Input, 
  Button, 
  Space, 
  Tag, 
  message, 
  Alert, 
  Spin,
  Checkbox,
  Divider,
  Typography,
  Card
} from 'antd';
import { 
  ClockCircleOutlined, 
  CalendarOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import { appointmentsApi, clientsApi, doctorsApi } from '../../services/api';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, Doctor } from '../../types';
import dayjs, { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

interface AppointmentFormAntdProps {
  appointment?: Appointment | null;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const REMINDER_OPTIONS = [
  { value: 'IMMEDIATE', label: 'Send Instant Now', icon: <CheckCircleOutlined />, color: 'blue' },
  { value: 'TEN_MINUTES_BEFORE', label: 'Send 10 Minutes Before', icon: <ClockCircleOutlined />, color: 'green' },
  { value: 'ONE_DAY_BEFORE', label: 'Send 1 Day Before', icon: <CalendarOutlined />, color: 'orange' },
];

export default function AppointmentFormAntd({ appointment, visible, onCancel, onSuccess }: AppointmentFormAntdProps) {
  const [form] = Form.useForm();
  const [clients, setClients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [customReminders, setCustomReminders] = useState<{ date: Dayjs | null; time: Dayjs | null }[]>([]);
  const [selectedReminderOptions, setSelectedReminderOptions] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setLoadingData(true);
      Promise.all([
        loadClients(),
        loadDoctors(),
      ]).finally(() => setLoadingData(false));
      
      if (appointment) {
        form.setFieldsValue({
          clientId: appointment.clientId,
          doctorId: appointment.doctorId,
          appointmentTime: dayjs(appointment.appointmentTime),
          notes: appointment.notes,
          status: appointment.status,
        });
        // Load existing reminder options if available
        setSelectedReminderOptions([]);
        setCustomReminders([]);
      } else {
        form.resetFields();
        setCustomReminders([]);
        setSelectedReminderOptions([]);
        setAvailabilityError(null);
      }
    }
  }, [visible, appointment]);

  // Watch form values for availability check
  const doctorId = Form.useWatch('doctorId', form);
  const appointmentTime = Form.useWatch('appointmentTime', form);

  useEffect(() => {
    if (doctorId && appointmentTime) {
      // Debounce the availability check
      const timer = setTimeout(() => {
        checkAvailability(doctorId, appointmentTime);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAvailabilityError(null);
    }
  }, [doctorId, appointmentTime]);

  const loadClients = async () => {
    try {
      const response = await clientsApi.getAll(0, 1000);
      setClients(response.content || []);
    } catch (err) {
      console.error('Failed to load clients', err);
      message.error('Failed to load clients. Please refresh the page.');
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await doctorsApi.getActive();
      setDoctors(data || []);
    } catch (err) {
      console.error('Failed to load doctors', err);
      message.error('Failed to load doctors. Please refresh the page.');
    }
  };

  const checkAvailability = async (doctorId: string, appointmentTime: Dayjs) => {
    if (!doctorId || !appointmentTime) return;
    
    setCheckingAvailability(true);
    setAvailabilityError(null);
    
    try {
      const excludeId = appointment?.id;
      const response = await doctorsApi.checkAvailability(
        doctorId,
        appointmentTime.toISOString(),
        excludeId
      );
      
      if (!response.available) {
        const doctor = doctors.find(d => d.id === doctorId);
        setAvailabilityError(`This time slot is already booked for Dr. ${doctor?.name || 'the selected doctor'}`);
      } else {
        setAvailabilityError(null);
      }
    } catch (err: any) {
      console.error('Failed to check availability', err);
      if (err.response?.status === 400) {
        setAvailabilityError(err.response.data.message || 'This time slot is not available');
      } else {
        // Don't show error for network issues, just log
        setAvailabilityError(null);
      }
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (availabilityError) {
        message.error('Please select an available time slot');
        setLoading(false);
        return;
      }

      const appointmentTimeISO = values.appointmentTime.toISOString();
      
      // Prepare reminder options (filter out empty selections)
      const reminderOptions = selectedReminderOptions.length > 0 ? selectedReminderOptions : undefined;
      
      // Combine custom reminders
      const customReminderTimes = customReminders
        .filter(cr => cr.date && cr.time)
        .map(cr => {
          const date = cr.date!.format('YYYY-MM-DD');
          const time = cr.time!.format('HH:mm');
          return `${date}T${time}:00`;
        });

      if (appointment) {
        const updateData: UpdateAppointmentRequest = {
          appointmentTime: appointmentTimeISO,
          doctorId: values.doctorId,
          notes: values.notes,
          status: values.status,
          reminderOptions: reminderOptions,
          customReminderTimes: customReminderTimes.length > 0 ? customReminderTimes : undefined,
        };
        await appointmentsApi.update(appointment.id, updateData);
        message.success('Appointment updated successfully');
      } else {
        const createData: CreateAppointmentRequest = {
          clientId: values.clientId,
          doctorId: values.doctorId,
          appointmentTime: appointmentTimeISO,
          notes: values.notes,
          reminderOptions: reminderOptions,
          customReminderTimes: customReminderTimes.length > 0 ? customReminderTimes : undefined,
        };
        await appointmentsApi.create(createData);
        message.success('Appointment created successfully');
      }

      onSuccess();
      form.resetFields();
      setCustomReminders([]);
      setSelectedReminderOptions([]);
      setAvailabilityError(null);
    } catch (err: any) {
      console.error('Failed to save appointment', err);
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors ? 
                            Object.values(err.response.data.errors).flat().join(', ') : 
                            'Failed to save appointment. Please try again.');
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addCustomReminder = () => {
    setCustomReminders([...customReminders, { date: null, time: null }]);
  };

  const removeCustomReminder = (index: number) => {
    setCustomReminders(customReminders.filter((_, i) => i !== index));
  };

  const updateCustomReminder = (index: number, field: 'date' | 'time', value: Dayjs | null) => {
    const updated = [...customReminders];
    updated[index] = { ...updated[index], [field]: value };
    setCustomReminders(updated);
  };

  const handleReminderOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedReminderOptions([...selectedReminderOptions, option]);
    } else {
      setSelectedReminderOptions(selectedReminderOptions.filter(o => o !== option));
    }
  };

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          <span>{appointment ? 'Edit Appointment' : 'Create New Appointment'}</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      okText={appointment ? 'Update Appointment' : 'Create Appointment'}
      cancelText="Cancel"
      destroyOnClose
      styles={{
        body: { padding: '24px' },
        header: { padding: '20px 24px', borderBottom: '1px solid var(--modal-border)' },
        footer: { padding: '12px 24px', borderTop: '1px solid var(--modal-border)' }
      }}
    >
      <Spin spinning={loadingData}>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="clientId"
            label={<Text strong>Client</Text>}
            rules={[{ required: true, message: 'Please select a client' }]}
          >
            <Select 
              placeholder="Select a client" 
              disabled={!!appointment}
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {clients.map((client) => (
                <Select.Option key={client.id} value={client.id}>
                  {client.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="doctorId"
            label={<Text strong>Doctor</Text>}
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <Select 
              placeholder="Select a doctor" 
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {doctors.map((doctor) => (
                <Select.Option key={doctor.id} value={doctor.id}>
                  {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="appointmentTime"
            label={<Text strong>Date & Time</Text>}
            rules={[{ required: true, message: 'Please select appointment time' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              size="large"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              onChange={() => {
                const doctorId = form.getFieldValue('doctorId');
                const appointmentTime = form.getFieldValue('appointmentTime');
                if (doctorId && appointmentTime) {
                  checkAvailability(doctorId, appointmentTime);
                }
              }}
            />
          </Form.Item>

          {checkingAvailability && (
            <Alert 
              message="Checking availability..." 
              type="info" 
              showIcon 
              style={{ marginBottom: 16, borderRadius: '6px' }} 
            />
          )}

          {availabilityError && (
            <Alert 
              message={availabilityError} 
              type="error" 
              showIcon 
              style={{ marginBottom: 16, borderRadius: '6px' }} 
            />
          )}

          {!availabilityError && !checkingAvailability && doctorId && appointmentTime && (
            <Alert 
              message="Time slot is available" 
              type="success" 
              showIcon 
              style={{ marginBottom: 16, borderRadius: '6px' }} 
            />
          )}

          <Form.Item name="notes" label={<Text strong>Notes</Text>}>
            <TextArea 
              rows={4} 
              placeholder="Additional notes or instructions..." 
              showCount
              maxLength={500}
            />
          </Form.Item>

          {appointment && (
            <Form.Item
              name="status"
              label={<Text strong>Status</Text>}
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Select status" size="large">
                <Select.Option value="SCHEDULED">
                  <Tag color="blue">Scheduled</Tag>
                </Select.Option>
                <Select.Option value="COMPLETED">
                  <Tag color="green">Completed</Tag>
                </Select.Option>
                <Select.Option value="CANCELLED">
                  <Tag color="red">Cancelled</Tag>
                </Select.Option>
              </Select>
            </Form.Item>
          )}

          <Divider orientation="left" style={{ margin: '24px 0' }}>
            <Text strong>Reminder Configuration</Text>
          </Divider>

          <Card 
            size="small" 
            style={{ 
              marginBottom: 16, 
              background: 'var(--background-tertiary)',
              border: '1px solid var(--border-color-light)',
              borderRadius: '8px'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {REMINDER_OPTIONS.map((option) => (
                <Checkbox
                  key={option.value}
                  checked={selectedReminderOptions.includes(option.value)}
                  onChange={(e) => handleReminderOptionChange(option.value, e.target.checked)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                >
                  <Space>
                    <span style={{ color: `var(--${option.color}-color)` }}>
                      {option.icon}
                    </span>
                    <Text>{option.label}</Text>
                  </Space>
                </Checkbox>
              ))}
            </Space>
          </Card>

          <div style={{ marginBottom: 16 }}>
            <Button 
              type="dashed" 
              onClick={addCustomReminder} 
              block 
              icon={<PlusOutlined />}
              size="large"
              style={{ borderRadius: '6px' }}
            >
              Add Custom Reminder
            </Button>
          </div>

          {customReminders.map((cr, index) => (
            <Card 
              key={index}
              size="small"
              style={{ 
                marginBottom: 12, 
                background: 'var(--background-base)',
                border: '1px solid var(--border-color-light)',
                borderRadius: '8px'
              }}
              bodyStyle={{ padding: '12px' }}
            >
              <Space style={{ width: '100%' }} align="center">
                <DatePicker
                  placeholder="Select date"
                  value={cr.date}
                  onChange={(date) => updateCustomReminder(index, 'date', date)}
                  disabledDate={(current) => {
                    const appointmentTime = form.getFieldValue('appointmentTime');
                    if (!appointmentTime) return false;
                    return current && (current > dayjs(appointmentTime) || current < dayjs());
                  }}
                  style={{ flex: 1 }}
                  size="large"
                />
                <DatePicker
                  picker="time"
                  placeholder="Select time"
                  value={cr.time}
                  onChange={(time) => updateCustomReminder(index, 'time', time)}
                  format="HH:mm"
                  style={{ flex: 1 }}
                  size="large"
                />
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeCustomReminder(index)}
                  size="large"
                >
                  Remove
                </Button>
              </Space>
            </Card>
          ))}
        </Form>
      </Spin>
    </Modal>
  );
}
