import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { X } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/assistant': 'AI Assistant',
  '/orders': 'Orders',
  '/invoices': 'Invoices',
  '/analytics': 'Analytics',
  '/upload': 'Upload Documents',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'FMC Operations';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={true}
        />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
