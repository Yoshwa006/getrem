import { Link, useLocation } from 'react-router-dom';
import { CalendarOutlined, UserOutlined, MedicineBoxOutlined, DollarOutlined, BellOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="nav-brand">
            <CalendarOutlined style={{ fontSize: '28px', color: 'white' }} />
            <h1>GetRem</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="nav-links">
              <Link to="/clients" className={isActive('/clients') ? 'active' : ''}>
                <UserOutlined style={{ marginRight: '6px' }} />
                Clients
              </Link>
              <Link to="/appointments" className={isActive('/appointments') ? 'active' : ''}>
                <CalendarOutlined style={{ marginRight: '6px' }} />
                Appointments
              </Link>
              <Link to="/doctors" className={isActive('/doctors') ? 'active' : ''}>
                <TeamOutlined style={{ marginRight: '6px' }} />
                Doctors
              </Link>
              <Link to="/treatments" className={isActive('/treatments') ? 'active' : ''}>
                <MedicineBoxOutlined style={{ marginRight: '6px' }} />
                Treatments
              </Link>
              <Link to="/payments" className={isActive('/payments') ? 'active' : ''}>
                <DollarOutlined style={{ marginRight: '6px' }} />
                Payments
              </Link>
              <Link to="/calendar" className={isActive('/calendar') ? 'active' : ''}>
                <CalendarOutlined style={{ marginRight: '6px' }} />
                Calendar
              </Link>
              <Link to="/notification-logs" className={isActive('/notification-logs') ? 'active' : ''}>
                <BellOutlined style={{ marginRight: '6px' }} />
                Logs
              </Link>
              <Link to="/email-test" className={isActive('/email-test') ? 'active' : ''}>
                <MailOutlined style={{ marginRight: '6px' }} />
                Test Email
              </Link>
            </div>
            <div className="navbar-actions">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

