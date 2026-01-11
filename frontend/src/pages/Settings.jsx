import { useState } from 'react';
import { Save, Bell, DollarSign, Users, Database, Shield } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    highValueThreshold: 50000,
    emailNotifications: true,
    telegramNotifications: true,
    autoProcess: true,
    defaultCurrency: 'USD',
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would call the API to save settings
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your dashboard preferences</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Alert Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Bell className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Alert Settings</h2>
            <p className="text-sm text-gray-500">Configure alert thresholds and notifications</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label">High-Value Transaction Threshold</label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={settings.highValueThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, highValueThreshold: parseInt(e.target.value) })
                }
                className="input pl-8"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Transactions above this amount will trigger alerts
            </p>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Telegram Notifications</p>
              <p className="text-sm text-gray-500">Receive alerts via Telegram bot</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.telegramNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, telegramNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Processing Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Processing Settings</h2>
            <p className="text-sm text-gray-500">Configure document processing options</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Auto-Process Documents</p>
              <p className="text-sm text-gray-500">Automatically process incoming documents</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoProcess}
                onChange={(e) =>
                  setSettings({ ...settings, autoProcess: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="label">Default Currency</label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) =>
                setSettings({ ...settings, defaultCurrency: e.target.value })
              }
              className="input max-w-xs"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="MXN">MXN - Mexican Peso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Integration Status</h2>
            <p className="text-sm text-gray-500">Connected services and integrations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Supabase</p>
                <p className="text-sm text-gray-500">Database connection</p>
              </div>
            </div>
            <span className="badge-green">Connected</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TG</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Telegram Bot</p>
                <p className="text-sm text-gray-500">Order_DB_Bot</p>
              </div>
            </div>
            <span className="badge-green">Connected</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GM</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Gmail</p>
                <p className="text-sm text-gray-500">Email integration</p>
              </div>
            </div>
            <span className="badge-green">Connected</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GS</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Google Sheets</p>
                <p className="text-sm text-gray-500">Spreadsheet export</p>
              </div>
            </div>
            <span className="badge-green">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
