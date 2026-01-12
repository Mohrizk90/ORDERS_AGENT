import { useState } from 'react';
import { Save, Bell, DollarSign, Users, Database, Shield, RefreshCw, CheckCircle, XCircle, AlertCircle, Info, Loader } from 'lucide-react';
import { testSupabaseConnection } from '../utils/testSupabaseConnection';

export default function Settings() {
  const [settings, setSettings] = useState({
    highValueThreshold: 50000,
    emailNotifications: true,
    telegramNotifications: true,
    autoProcess: true,
    defaultCurrency: 'USD',
  });

  const [connectionTest, setConnectionTest] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would call the API to save settings
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionTest(null);
    
    try {
      const result = await testSupabaseConnection();
      setConnectionTest(result);
    } catch (error) {
      setConnectionTest({
        connected: false,
        error: error.message || 'Failed to test connection',
        tests: [],
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return 'badge-green';
      case 'error':
        return 'badge-red';
      case 'warning':
        return 'badge-yellow';
      case 'info':
        return 'badge-blue';
      default:
        return 'badge-gray';
    }
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

      {/* Supabase Connection Test */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Supabase Connection Test</h2>
              <p className="text-sm text-gray-500">Test your database connection and verify tables</p>
            </div>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="btn btn-secondary"
          >
            {testingConnection ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Connection
              </>
            )}
          </button>
        </div>

        {connectionTest && (
          <div className="space-y-4">
            {/* Connection Summary */}
            <div className={`p-4 rounded-lg border-2 ${
              connectionTest.connected 
                ? 'bg-green-50 border-green-200' 
                : connectionTest.error
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start gap-3">
                {connectionTest.connected ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : connectionTest.error ? (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {connectionTest.connected 
                      ? 'Connection Successful!' 
                      : connectionTest.error
                      ? 'Connection Failed'
                      : 'Connection Status'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>URL:</strong> {connectionTest.url}</p>
                    <p><strong>API Key:</strong> {connectionTest.hasKey ? '✓ Configured' : '✗ Missing'}</p>
                    <p><strong>Mock Data:</strong> {connectionTest.useMockData ? 'Enabled' : 'Disabled'}</p>
                    {connectionTest.error && (
                      <p className="text-red-600 font-medium mt-2">Error: {connectionTest.error}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {connectionTest.tests.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Test Results</h3>
                <div className="space-y-2">
                  {connectionTest.tests.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{test.name}</p>
                          <span className={getStatusBadge(test.status)}>
                            {test.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{test.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!connectionTest && !testingConnection && (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Click "Test Connection" to verify your Supabase setup</p>
          </div>
        )}
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
            <span className={connectionTest?.connected ? 'badge-green' : connectionTest?.error ? 'badge-red' : 'badge-yellow'}>
              {connectionTest?.connected ? 'Connected' : connectionTest ? 'Not Connected' : 'Unknown'}
            </span>
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
