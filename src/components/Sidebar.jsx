import { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MonitorPlay, 
  ClipboardCheck, 
  Video, 
  Sliders, 
  Bell,
  Users,
  BookOpen,
  Layers,
  Radio,
  FileText,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';

const Sidebar = ({ toggleMobileMenu, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();

  const roleLower = userRole?.toLowerCase() || '';
  const isStudent = roleLower === ROLES.STUDENT?.toLowerCase() || roleLower === 'student';
  const isAdmin = roleLower === ROLES.ADMIN?.toLowerCase() || roleLower === 'admin';

  const handleNavigation = (path) => {
    navigate(path);
    if (toggleMobileMenu) toggleMobileMenu();
  };

  // 1. Navigation items for ADMIN
  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/courses', label: 'Course Management', icon: BookOpen },
    { path: '/admin/batches', label: 'Batch Management', icon: Layers },
    { path: '/admin/exams', label: 'Exams & Quizzes', icon: FileText },
    { path: '/admin/assignments', label: 'Assignments', icon: FileCheck },
    { path: '/admin/live-monitoring', label: 'Live Monitoring', icon: Radio },
    { path: '/digital-classroom', label: 'Digital Classroom', icon: MonitorPlay },
    { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
    { path: '/session-recordings', label: 'Session Recordings', icon: Video },
    { path: '/session-management', label: 'Session Control', icon: Sliders },
    { path: '/notifications', label: 'Notifications', icon: Bell },
  ];

  // 2. Navigation items for TRAINER
  const trainerNavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/exams', label: 'Exams & Quizzes', icon: FileText },
    { path: '/admin/assignments', label: 'Assignments', icon: FileCheck },
    { path: '/digital-classroom', label: 'Digital Classroom', icon: MonitorPlay },
    { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
    { path: '/session-recordings', label: 'Session Recordings', icon: Video },
    { path: '/session-management', label: 'Session Management', icon: Sliders },
    { path: '/notifications', label: 'Notifications', icon: Bell },
  ];

  // 3. Navigation items for STUDENT
  const studentNavItems = [
    { path: '/digital-classroom', label: 'Digital Classroom', icon: MonitorPlay },
    { path: '/student/exams', label: 'Exams & Quizzes', icon: FileText },
    { path: '/student/assignments', label: 'Assignments', icon: FileCheck },
    { path: '/session-recordings', label: 'Session Recordings', icon: Video },
    { path: '/notifications-inbox', label: 'Notifications', icon: Bell },
  ];

  const navItems = isStudent 
    ? studentNavItems 
    : isAdmin 
      ? adminNavItems 
      : trainerNavItems;

  const workspaceTitle = isStudent 
    ? 'Student Workspace' 
    : isAdmin 
      ? 'Admin Workspace' 
      : 'Trainer Workspace';

  return (
    <aside className="h-full w-64 bg-white border-r border-slate-200/80 flex flex-col">
      <nav className="flex-1 overflow-y-auto px-3.5 py-6 space-y-1">
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {workspaceTitle}
        </div>
        
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
          const IconComponent = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <IconComponent 
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                }`} 
                strokeWidth={ isActive ? 2.2 : 1.8 }
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default memo(Sidebar);