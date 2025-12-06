import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Card, 
  List, 
  Tag, 
  Typography, 
  Space, 
  Select, 
  message, 
  Empty, 
  Spin,
  Badge,
  Divider
} from 'antd';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, FilterOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { appointmentsApi, doctorsApi } from '../../services/api';
import type { CalendarAppointmentResponse, AppointmentStatus, Doctor } from '../../types';
import { format } from 'date-fns';

const { Text } = Typography;

export default function CalendarViewAntd() {
  const [appointments, setAppointments] = useState<CalendarAppointmentResponse[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<CalendarAppointmentResponse[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      setFilteredAppointments(appointments.filter(apt => apt.doctorId === selectedDoctorId));
    } else {
      setFilteredAppointments(appointments);
    }
  }, [selectedDoctorId, appointments]);

  const loadDoctors = async () => {
    try {
      const data = await doctorsApi.getActive();
      setDoctors(data || []);
    } catch (err) {
      console.error('Failed to load doctors', err);
    }
  };

  const loadAppointments = async (year?: number, month?: number) => {
    try {
      setLoading(true);
      const now = new Date();
      const targetYear = year || now.getFullYear();
      const targetMonth = month !== undefined ? month : now.getMonth() + 1;
      const data = await appointmentsApi.getForMonth(targetYear, targetMonth);
      setAppointments(data || []);
    } catch (err: any) {
      console.error('Failed to load appointments', err);
      message.error('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDate = (date: Dayjs) => {
    return filteredAppointments.filter((apt) => {
      const aptDate = dayjs(apt.appointmentTime);
      return aptDate.isSame(date, 'day');
    });
  };

  const dateCellRender = (value: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(value);
    if (dayAppointments.length === 0) return null;
    
    return (
      <div style={{ padding: '4px 0' }}>
        {dayAppointments.slice(0, 2).map((apt) => (
          <div key={apt.id} style={{ marginBottom: 4 }}>
            <Tag 
              color={getStatusColor(apt.status)} 
              style={{ 
                fontSize: '11px', 
                margin: 0,
                borderRadius: '4px',
                padding: '2px 6px',
                lineHeight: '1.4'
              }}
            >
              {format(new Date(apt.appointmentTime), 'HH:mm')} - {apt.clientName}
            </Tag>
          </div>
        ))}
        {dayAppointments.length > 2 && (
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
            +{dayAppointments.length - 2} more
          </div>
        )}
      </div>
    );
  };

  const getStatusColor = (status: AppointmentStatus) => {
    const colors: Record<AppointmentStatus, string> = {
      SCHEDULED: 'blue',
      COMPLETED: 'green',
      CANCELLED: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig: Record<AppointmentStatus, { color: string; text: string }> = {
      SCHEDULED: { color: 'processing', text: 'Scheduled' },
      COMPLETED: { color: 'success', text: 'Completed' },
      CANCELLED: { color: 'error', text: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Badge status={config.color as any} text={config.text} />;
  };

  const selectedAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Calendar View</h2>
        <Select
          placeholder="Filter by doctor"
          allowClear
          style={{ width: 280 }}
          size="large"
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
          suffixIcon={<FilterOutlined />}
        >
          {doctors.map((doctor) => (
            <Select.Option key={doctor.id} value={doctor.id}>
              {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Spin spinning={loading}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              dateCellRender={dateCellRender}
              onPanelChange={(date) => {
                setSelectedDate(date);
                loadAppointments(date.year(), date.month() + 1);
              }}
              style={{ 
                border: 'none',
                background: 'transparent'
              }}
            />
          </Card>

          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                <Text strong>Appointments for {selectedDate.format('MMMM DD, YYYY')}</Text>
                <Badge count={selectedAppointments.length} showZero style={{ backgroundColor: 'var(--primary-color)' }} />
              </Space>
            }
          >
            {selectedAppointments.length > 0 ? (
              <List
                dataSource={selectedAppointments}
                renderItem={(apt) => (
                  <List.Item
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      border: '1px solid var(--border-color-light)',
                      borderRadius: '8px',
                      background: 'var(--background-tertiary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <UserOutlined />
                          <Text strong style={{ fontSize: '16px' }}>{apt.clientName}</Text>
                          {getStatusBadge(apt.status)}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%', marginTop: '8px' }}>
                          <div>
                            <Text strong>Doctor: </Text>
                            <Text>{apt.doctorName}</Text>
                            {apt.doctorSpecialization && (
                              <Tag color="blue" style={{ marginLeft: 8 }}>{apt.doctorSpecialization}</Tag>
                            )}
                          </div>
                          <div>
                            <ClockCircleOutlined style={{ marginRight: 8, color: 'var(--text-tertiary)' }} />
                            <Text>{format(new Date(apt.appointmentTime), 'MMMM dd, yyyy HH:mm')}</Text>
                          </div>
                          {apt.notes && (
                            <div>
                              <Text strong>Notes: </Text>
                              <Text type="secondary">{apt.notes}</Text>
                            </div>
                          )}
                          {apt.reminderSchedules.length > 0 && (
                            <>
                              <Divider style={{ margin: '8px 0' }} />
                              <div>
                                <Text strong>Reminders: </Text>
                                <Space style={{ marginLeft: 8 }} wrap>
                                  {apt.reminderSchedules.map((reminder) => (
                                    <Tag 
                                      key={reminder.reminderId} 
                                      color="cyan"
                                      style={{ borderRadius: '4px' }}
                                    >
                                      {reminder.type.replace(/_/g, ' ').toLowerCase()} - {reminder.status.toLowerCase()}
                                    </Tag>
                                  ))}
                                </Space>
                              </div>
                            </>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={
                  <Text type="secondary">No appointments scheduled for this date</Text>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Space>
      </Spin>
    </div>
  );
}
