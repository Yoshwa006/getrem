import { Link, useLocation } from 'react-router-dom';
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
        <div className="nav-brand">
          <h1>GetRem</h1>
        </div>
        <div className="nav-links">
          <Link to="/clients" className={isActive('/clients') ? 'active' : ''}>
            Clients
          </Link>
          <Link to="/appointments" className={isActive('/appointments') ? 'active' : ''}>
            Appointments
          </Link>
          <Link to="/treatments" className={isActive('/treatments') ? 'active' : ''}>
            Treatments
          </Link>
          <Link to="/payments" className={isActive('/payments') ? 'active' : ''}>
            Payments
          </Link>
          <Link to="/calendar" className={isActive('/calendar') ? 'active' : ''}>
            Calendar
          </Link>
          <Link to="/notification-logs" className={isActive('/notification-logs') ? 'active' : ''}>
            Notification Logs
          </Link>
          <Link to="/email-test" className={isActive('/email-test') ? 'active' : ''}>
            Test Email
          </Link>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

