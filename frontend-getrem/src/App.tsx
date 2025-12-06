import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ClientsList from './components/Clients/ClientsList';
import AppointmentsList from './components/Appointments/AppointmentsList';
import DoctorsList from './components/Doctors/DoctorsList';
import TreatmentsList from './components/Treatments/TreatmentsList';
import PaymentsList from './components/Payments/PaymentsList';
import CalendarViewAntd from './components/Calendar/CalendarViewAntd';
import NotificationLogsPage from './components/NotificationLogs/NotificationLogsPage';
import EmailTestPage from './components/EmailTest/EmailTestPage';
import './App.css';

function AppContent() {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: theme === 'dark' ? '#1f1f1f' : '#ffffff',
          colorBgElevated: theme === 'dark' ? '#1f1f1f' : '#ffffff',
          colorBgLayout: theme === 'dark' ? '#141414' : '#fafafa',
          colorText: theme === 'dark' ? '#e6e6e6' : '#262626',
          colorTextSecondary: theme === 'dark' ? '#b3b3b3' : '#595959',
          colorTextTertiary: theme === 'dark' ? '#8c8c8c' : '#8c8c8c',
          colorBorder: theme === 'dark' ? '#434343' : '#d9d9d9',
          colorBorderSecondary: theme === 'dark' ? '#303030' : '#f0f0f0',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/clients" replace />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/treatments" element={<TreatmentsList />} />
            <Route path="/payments" element={<PaymentsList />} />
            <Route path="/calendar" element={<CalendarViewAntd />} />
            <Route path="/notification-logs" element={<NotificationLogsPage />} />
            <Route path="/email-test" element={<EmailTestPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
