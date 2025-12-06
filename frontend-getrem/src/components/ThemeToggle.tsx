import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
      <Button
        type="text"
        icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      />
    </Tooltip>
  );
}

