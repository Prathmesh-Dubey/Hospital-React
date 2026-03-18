import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Building2, 
  Pill, 
  TestTube, 
  FileText, 
  LogOut,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { Button } from './UI';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-emerald-50 text-emerald-600 font-medium' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const role = localStorage.getItem('role') || 'PATIENT';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = {
    ADMIN: [
      { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { to: '/admin/clinics', icon: <Building2 size={20} />, label: 'Clinics' },
      { to: '/admin/doctors', icon: <Stethoscope size={20} />, label: 'Doctors' },
      { to: '/admin/patients', icon: <Users size={20} />, label: 'Patients' },
      { to: '/admin/admins', icon: <Users size={20} />, label: 'Admins' },
    ],
    DOCTOR: [
      { to: '/doctor/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { to: '/doctor/patients', icon: <Users size={20} />, label: 'My Patients' },
      { to: '/doctor/prescriptions', icon: <FileText size={20} />, label: 'Prescriptions' },
      { to: '/doctor/medicines', icon: <Pill size={20} />, label: 'Medicines' },
      { to: '/doctor/tests', icon: <TestTube size={20} />, label: 'Medical Tests' },
    ],
    PATIENT: [
      { to: '/patient/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { to: '/patient/prescriptions', icon: <FileText size={20} />, label: 'My Prescriptions' },
      { to: '/patient/medicines', icon: <Pill size={20} />, label: 'My Medicines' },
      { to: '/patient/tests', icon: <TestTube size={20} />, label: 'My Tests' },
      { to: '/patient/doctors', icon: <Stethoscope size={20} />, label: 'My Doctors' },
    ],
  };

  const currentMenuItems = menuItems[role as keyof typeof menuItems] || [];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar Desktop — fixed, full height */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 p-6 z-30">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900">HealthCare</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {currentMenuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-3 px-2 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <Users className="text-slate-500 w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user.username || user.name || user.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="text-emerald-600 w-6 h-6" />
          <span className="font-bold text-slate-900">HealthCare</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-16 p-6">
          <nav className="space-y-2">
            {currentMenuItems.map((item) => (
              <SidebarItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 mt-6"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content — offset by sidebar width */}
      <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
        {children}
      </main>

    </div>
  );
};