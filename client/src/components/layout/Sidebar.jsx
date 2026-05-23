import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  CheckCircle2,
  Trophy,
  FileText,
  Medal,
  User,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Terminal,
  Layers,
  RefreshCw,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/problems', label: 'Problems', icon: Code2 },
  { to: '/sheets', label: 'Sheets', icon: Layers },
  { to: '/revisions', label: 'Revisions', icon: RefreshCw },
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/submissions', label: 'Submissions', icon: CheckCircle2 },
  { to: '/contests', label: 'Contests', icon: Trophy },
  { to: '/notes', label: 'Notes', icon: FileText },
  { to: '/leaderboard', label: 'Leaderboard', icon: Medal },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
     ${isActive
       ? 'bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/10'
       : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
     }`;

  const allNav = [
    ...navItems,
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  /* ── Sidebar content (shared between desktop & mobile) ── */
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-700/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="text-lg font-bold text-dark-100 tracking-tight">
            DSA <span className="text-emerald-400">Tracker</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {allNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={linkClasses}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-dark-700/50 space-y-2">
        {(!collapsed || isMobile) && user && (
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-dark-200 truncate">
              {user.full_name || user.username}
            </p>
            <p className="text-xs text-dark-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-dark-900/80 backdrop-blur-xl
        border-b border-dark-700/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-dark-100">
            DSA <span className="text-emerald-400">Tracker</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-dark-900 border-r border-dark-700/50
            shadow-2xl animate-slide-in">
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-30
          bg-dark-900/80 backdrop-blur-xl border-r border-dark-700/50
          transition-all duration-300
          ${collapsed ? 'w-[68px]' : 'w-64'}`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-800 border border-dark-700
            text-dark-400 hover:text-dark-200 flex items-center justify-center
            hover:bg-dark-700 transition-all duration-200 shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-dark-900/90 backdrop-blur-xl
        border-t border-dark-700/50 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-all
               ${isActive ? 'text-emerald-400' : 'text-dark-500'}`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label.slice(0, 5)}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
