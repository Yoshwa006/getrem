import { useState, useEffect } from 'react';
import { Calendar, Card, List, Tag, Typography, Space, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { appointmentsApi, doctorsApi } from '../../services/api';
import type { CalendarAppointmentResponse, AppointmentStatus, Doctor } from '../../types';
import { format } from 'date-fns';

const { Title } = Typography;

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

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const data = await appointmentsApi.getForMonth(now.getFullYear(), now.getMonth() + 1);
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to load appointments', err);
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
    return (
      <div>
        {dayAppointments.slice(0, 2).map((apt) => (
          <div key={apt.id} style={{ marginBottom: 4 }}>
            <Tag color={getStatusColor(apt.status)} style={{ fontSize: '10px', margin: 0 }}>
              {format(new Date(apt.appointmentTime), 'HH:mm')} - {apt.clientName}
            </Tag>
          </div>
        ))}
        {dayAppointments.length > 2 && (
          <div style={{ fontSize: '10px', color: '#999' }}>
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

  const selectedAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>Calendar</Title>
        <Select
          placeholder="Filter by doctor"
          allowClear
          style={{ width: 250 }}
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
        >
          {doctors.map((doctor) => (
            <Select.Option key={doctor.id} value={doctor.id}>
              {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
            </Select.Option>
          ))}
        </Select>
      </Space>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            dateCellRender={dateCellRender}
            onPanelChange={(date) => {
              setSelectedDate(date);
              loadAppointments();
            }}
          />
        </Card>

        {selectedAppointments.length > 0 && (
          <Card title={`Appointments for ${selectedDate.format('MMMM DD, YYYY')}`}>
            <List
              dataSource={selectedAppointments}
              renderItem={(apt) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{apt.clientName}</span>
                        <Tag color={getStatusColor(apt.status)}>{apt.status}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>
                          <strong>Doctor:</strong> {apt.doctorName}
                          {apt.doctorSpecialization && (
                            <Tag color="blue" style={{ marginLeft: 8 }}>{apt.doctorSpecialization}</Tag>
                          )}
                        </div>
                        <div>{format(new Date(apt.appointmentTime), 'MMMM dd, yyyy HH:mm')}</div>
                        {apt.notes && <div>{apt.notes}</div>}
                        {apt.reminderSchedules.length > 0 && (
                          <div>
                            <strong>Reminders:</strong>
                            <Space style={{ marginLeft: 8 }}>
                              {apt.reminderSchedules.map((reminder) => (
                                <Tag key={reminder.reminderId} color="cyan">
                                  {reminder.type.replace(/_/g, ' ')} - {reminder.status}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </Space>
    </div>
  );
}

