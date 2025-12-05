import { useState, useEffect } from 'react';
import { Modal, Form, Select, DatePicker, Input, TimePicker, Checkbox, Button, Space, Tag, message, Alert } from 'antd';
import { appointmentsApi, clientsApi, reminderRulesApi, doctorsApi } from '../../services/api';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, ReminderRule, Doctor } from '../../types';
import dayjs, { Dayjs } from 'dayjs';

const { TextArea } = Input;

interface AppointmentFormAntdProps {
  appointment?: Appointment | null;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AppointmentFormAntd({ appointment, visible, onCancel, onSuccess }: AppointmentFormAntdProps) {
  const [form] = Form.useForm();
  const [clients, setClients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [customReminders, setCustomReminders] = useState<{ date: Dayjs | null; time: Dayjs | null }[]>([]);

  useEffect(() => {
    if (visible) {
      loadClients();
      loadDoctors();
      loadReminderRules();
      if (appointment) {
        form.setFieldsValue({
          clientId: appointment.clientId,
          doctorId: appointment.doctorId,
          appointmentTime: dayjs(appointment.appointmentTime),
          notes: appointment.notes,
        });
      } else {
        form.resetFields();
        setCustomReminders([]);
        setAvailabilityError(null);
      }
    }
  }, [visible, appointment]);

  useEffect(() => {
    const doctorId = form.getFieldValue('doctorId');
    const appointmentTime = form.getFieldValue('appointmentTime');
    
    if (doctorId && appointmentTime) {
      checkAvailability(doctorId, appointmentTime);
    } else {
      setAvailabilityError(null);
    }
  }, [form.getFieldValue('doctorId'), form.getFieldValue('appointmentTime')]);

  const loadClients = async () => {
    try {
      const response = await clientsApi.getAll(0, 1000);
      setClients(response.content || []);
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await doctorsApi.getActive();
      setDoctors(data || []);
    } catch (err) {
      console.error('Failed to load doctors', err);
    }
  };

  const loadReminderRules = async () => {
    try {
      const data = await reminderRulesApi.getActive();
      setReminderRules(data || []);
    } catch (err) {
      console.error('Failed to load reminder rules', err);
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
      }
    } catch (err: any) {
      console.error('Failed to check availability', err);
      if (err.response?.status === 400) {
        setAvailabilityError(err.response.data.message || 'This time slot is not available');
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
        return;
      }

      const appointmentTime = values.appointmentTime.toISOString();
      const reminderRuleIds = values.reminderRuleIds || [];
      
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
          appointmentTime,
          doctorId: values.doctorId,
          notes: values.notes,
          reminderRuleIds: reminderRuleIds.length > 0 ? reminderRuleIds : undefined,
          customReminderTimes: customReminderTimes.length > 0 ? customReminderTimes : undefined,
        };
        await appointmentsApi.update(appointment.id, updateData);
      } else {
        const createData: CreateAppointmentRequest = {
          clientId: values.clientId,
          doctorId: values.doctorId,
          appointmentTime,
          notes: values.notes,
          reminderRuleIds: reminderRuleIds.length > 0 ? reminderRuleIds : undefined,
          customReminderTimes: customReminderTimes.length > 0 ? customReminderTimes : undefined,
        };
        await appointmentsApi.create(createData);
      }

      onSuccess();
      form.resetFields();
      setCustomReminders([]);
    } catch (err: any) {
      console.error('Failed to save appointment', err);
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

  return (
    <Modal
      title={appointment ? 'Edit Appointment' : 'Create Appointment'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="clientId"
          label="Client"
          rules={[{ required: true, message: 'Please select a client' }]}
        >
          <Select placeholder="Select client" disabled={!!appointment}>
            {clients.map((client) => (
              <Select.Option key={client.id} value={client.id}>
                {client.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="doctorId"
          label="Doctor"
          rules={[{ required: true, message: 'Please select a doctor' }]}
        >
          <Select placeholder="Select doctor">
            {doctors.map((doctor) => (
              <Select.Option key={doctor.id} value={doctor.id}>
                {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="appointmentTime"
          label="Date & Time"
          rules={[{ required: true, message: 'Please select appointment time' }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%' }}
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
          <Alert message="Checking availability..." type="info" showIcon style={{ marginBottom: 16 }} />
        )}

        {availabilityError && (
          <Alert message={availabilityError} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form.Item name="notes" label="Notes">
          <TextArea rows={3} placeholder="Additional notes" />
        </Form.Item>

        <Form.Item label="Reminder Configuration">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item name="reminderRuleIds" noStyle>
              <Select
                mode="multiple"
                placeholder="Select reminder rules"
                style={{ width: '100%' }}
              >
                {reminderRules.map((rule) => (
                  <Select.Option key={rule.id} value={rule.id}>
                    {rule.name}
                    {rule.isInstant && <Tag color="blue" style={{ marginLeft: 8 }}>Instant</Tag>}
                    {rule.hoursBefore && <Tag color="green">{rule.hoursBefore}h before</Tag>}
                    {rule.minutesBefore && <Tag color="orange">{rule.minutesBefore}m before</Tag>}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <div>
              <Button type="dashed" onClick={addCustomReminder} block>
                + Add Custom Reminder Time
              </Button>
              {customReminders.map((cr, index) => (
                <Space key={index} style={{ marginTop: 8, width: '100%' }} align="baseline">
                  <DatePicker
                    placeholder="Date"
                    value={cr.date}
                    onChange={(date) => updateCustomReminder(index, 'date', date)}
                    disabledDate={(current) => {
                      const appointmentTime = form.getFieldValue('appointmentTime');
                      if (!appointmentTime) return false;
                      return current && (current > dayjs(appointmentTime) || current < dayjs());
                    }}
                  />
                  <TimePicker
                    placeholder="Time"
                    value={cr.time}
                    onChange={(time) => updateCustomReminder(index, 'time', time)}
                    format="HH:mm"
                  />
                  <Button danger onClick={() => removeCustomReminder(index)}>
                    Remove
                  </Button>
                </Space>
              ))}
            </div>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

