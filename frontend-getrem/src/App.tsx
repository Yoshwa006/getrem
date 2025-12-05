import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Layout from './components/Layout';
import ClientsList from './components/Clients/ClientsList';
import AppointmentsList from './components/Appointments/AppointmentsList';
import TreatmentsList from './components/Treatments/TreatmentsList';
import PaymentsList from './components/Payments/PaymentsList';
import CalendarViewAntd from './components/Calendar/CalendarViewAntd';
import NotificationLogsPage from './components/NotificationLogs/NotificationLogsPage';
import EmailTestPage from './components/EmailTest/EmailTestPage';
import './App.css';

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/clients" replace />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/appointments" element={<AppointmentsList />} />
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

export default App;
