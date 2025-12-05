import { useState, useEffect } from 'react';
import { appointmentsApi } from '../../services/api';
import type { CalendarAppointmentResponse } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import './CalendarView.css';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<CalendarAppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const data = await appointmentsApi.getForMonth(year, month);
      setAppointments(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentTime);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="calendar-nav">
          <button onClick={previousMonth} className="btn btn-sm">
            ← Previous
          </button>
          <h3>{format(currentDate, 'MMMM yyyy')}</h3>
          <button onClick={nextMonth} className="btn btn-sm">
            Next →
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading calendar...</div>
      ) : (
        <>
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-days">
              {days.map((day) => {
                const dayAppointments = getAppointmentsForDate(day);
                const isSelected = selectedDate && isSameMonth(day, selectedDate) && day.getDate() === selectedDate.getDate();
                return (
                  <div
                    key={day.toISOString()}
                    className={`calendar-day ${isToday(day) ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isSameMonth(day, currentDate) ? 'other-month' : ''}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="day-number">{format(day, 'd')}</div>
                    <div className="day-appointments">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          className={`appointment-dot status-${apt.status.toLowerCase()}`}
                          title={`${apt.clientName} - ${format(new Date(apt.appointmentTime), 'HH:mm')}`}
                        />
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="more-appointments">+{dayAppointments.length - 3}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="selected-date-appointments">
              <h3>Appointments for {format(selectedDate, 'MMMM dd, yyyy')}</h3>
              {selectedAppointments.length === 0 ? (
                <p>No appointments scheduled</p>
              ) : (
                <div className="appointments-list">
                  {selectedAppointments.map((apt) => (
                    <div key={apt.id} className="appointment-card">
                      <div className="appointment-header">
                        <strong>{apt.clientName}</strong>
                        <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="appointment-time">
                        {format(new Date(apt.appointmentTime), 'HH:mm')}
                      </div>
                      {apt.notes && <div className="appointment-notes">{apt.notes}</div>}
                      {apt.reminderSchedules.length > 0 && (
                        <div className="reminder-info">
                          <strong>Reminders:</strong>
                          <ul>
                            {apt.reminderSchedules.map((reminder) => (
                              <li key={reminder.reminderId}>
                                {reminder.type.replace(/_/g, ' ')} - {reminder.status}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

