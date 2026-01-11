import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Analytics from './pages/Analytics';
import Upload from './pages/Upload';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="orders" element={<Orders />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="upload" element={<Upload />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  );
}

export default App;
