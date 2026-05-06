import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/useAdminAuth';
import {
  LayoutDashboard, Package, Tag, Users, ShoppingCart,
  Warehouse, Shield, LogOut, Menu, X, ChevronDown
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/users', icon: Users, label: 'Users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
];

const AdminLayout = () => {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isSuperAdmin = adminUser?.role === 'SUPER_ADMIN';

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const adminRole = adminUser?.role;

  const allNavItems = [
    ...navItems.filter(item => !item.roles || item.roles.includes(adminRole)),
    ...(isSuperAdmin ? [{ to: '/admin/admins', icon: Shield, label: 'Admins' }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-[260px] bg-[#0F1629] border-r border-white/[0.06]
        flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">FS</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">FitnessStore</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Panel</p>
          </div>
          <button className="ml-auto lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {allNavItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary-500/10 text-primary-400 shadow-sm shadow-primary-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-primary-500/20' : 'bg-white/[0.04] group-hover:bg-white/[0.08]'}`}>
                      <Icon size={16} className={isActive ? 'text-primary-400' : ''} />
                    </div>
                    {label}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <div className="p-1.5 rounded-md bg-red-500/10">
              <LogOut size={16} />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-[#0F1629]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 lg:px-6 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.04] mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-orange flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {adminUser?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm text-white font-medium">{adminUser?.fullName || 'Admin'}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{adminUser?.role || 'ADMIN'}</p>
              </div>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A2035] border border-white/[0.08] rounded-xl shadow-2xl z-50 py-1">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm text-white font-medium truncate">{adminUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
