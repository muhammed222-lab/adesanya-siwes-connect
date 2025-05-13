
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, Calendar, MessageSquare, FileText, 
  Building, Users, CreditCard, LogOut, Menu, X, BellRing, User
} from 'lucide-react';
import Logo from '../Logo';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = {
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: <BarChart3 size={20} /> },
      { name: 'Weekly Reports', path: '/student/reports', icon: <FileText size={20} /> },
      { name: 'SIWES Organization', path: '/student/organization', icon: <Building size={20} /> },
      { name: 'Messages', path: '/student/messages', icon: <MessageSquare size={20} /> },
      { name: 'Payment', path: '/student/payment', icon: <CreditCard size={20} /> },
    ],
    supervisor: [
      { name: 'Dashboard', path: '/supervisor/dashboard', icon: <BarChart3 size={20} /> },
      { name: 'Students', path: '/supervisor/students', icon: <Users size={20} /> },
      { name: 'Reports', path: '/supervisor/reports', icon: <FileText size={20} /> },
      { name: 'Messages', path: '/supervisor/messages', icon: <MessageSquare size={20} /> },
      { name: 'Calendar', path: '/supervisor/calendar', icon: <Calendar size={20} /> },
    ],
    coordinator: [
      { name: 'Dashboard', path: '/coordinator/dashboard', icon: <BarChart3 size={20} /> },
      { name: 'Students', path: '/coordinator/students', icon: <Users size={20} /> },
      { name: 'Organizations', path: '/coordinator/organizations', icon: <Building size={20} /> },
      { name: 'Reports', path: '/coordinator/reports', icon: <FileText size={20} /> },
      { name: 'Supervisors', path: '/coordinator/supervisors', icon: <User size={20} /> },
      { name: 'Messages', path: '/coordinator/messages', icon: <MessageSquare size={20} /> },
    ],
  };

  const currentNavItems = navItems[user.role] || [];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <aside className={`bg-white shadow-md w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
        <div className="p-6">
          <Logo small />
        </div>
        
        <div className="px-4 py-2">
          <p className="text-sm text-gray-500">Logged in as:</p>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
        
        <nav className="mt-6">
          <ul>
            {currentNavItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.path} 
                  className="flex items-center px-6 py-3 text-gray-700 hover:bg-aapoly-light hover:text-aapoly-purple transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="mr-3 text-gray-600">{item.icon}</span>
                  {item.name}
                </a>
              </li>
            ))}
            
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center px-6 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors"
              >
                <span className="mr-3"><LogOut size={20} /></span>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between z-20">
          <div className="flex items-center">
            <button 
              className="mr-4 text-gray-600 md:hidden" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <BellRing size={20} />
            </Button>
            <div className="hidden md:block">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-aapoly-purple text-white flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
