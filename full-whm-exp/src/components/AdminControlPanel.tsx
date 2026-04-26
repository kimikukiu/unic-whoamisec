import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';

interface AdminControlPanelProps {
  addLog: (message: string, level: LogEntry['level']) => void;
}

interface TelegramConfig {
  botToken: string;
  adminChatId: string;
  enabled: boolean;
  webhookUrl?: string;
}

interface Subscriber {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  joinedDate: string;
  status: 'active' | 'inactive' | 'banned';
  permissions: string[];
}

const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ addLog }) => {
  const [config, setConfig] = useState<TelegramConfig>({
    botToken: '',
    adminChatId: '',
    enabled: false,
    webhookUrl: ''
  });
  
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'bot' | 'subscribers' | 'stats'>('bot');

  useEffect(() => {
    loadConfig();
    loadSubscribers();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/telegram-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const loadSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Failed to load subscribers:', error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/telegram-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        addLog('Telegram bot configuration updated successfully', 'success');
      } else {
        addLog('Failed to update Telegram bot configuration', 'error');
      }
    } catch (error) {
      addLog('Error updating Telegram bot configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const testBot = async () => {
    try {
      const response = await fetch('/api/admin/test-bot', {
        method: 'POST'
      });
      
      if (response.ok) {
        addLog('Telegram bot test completed successfully', 'success');
      } else {
        addLog('Telegram bot test failed', 'error');
      }
    } catch (error) {
      addLog('Error testing Telegram bot', 'error');
    }
  };

  const updateSubscriberStatus = async (subscriberId: string, status: Subscriber['status']) => {
    try {
      const response = await fetch(`/api/admin/subscribers/${subscriberId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        addLog(`Subscriber ${subscriberId} status updated to ${status}`, 'success');
        loadSubscribers();
      }
    } catch (error) {
      addLog('Error updating subscriber status', 'error');
    }
  };

  const sendBroadcast = async (message: string) => {
    try {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (response.ok) {
        addLog('Broadcast message sent successfully', 'success');
      } else {
        addLog('Failed to send broadcast message', 'error');
      }
    } catch (error) {
      addLog('Error sending broadcast message', 'error');
    }
  };

  const tabs = [
    { id: 'bot', label: 'Bot Configuration', icon: '🤖' },
    { id: 'subscribers', label: 'Subscribers', icon: '👥' },
    { id: 'stats', label: 'Statistics', icon: '📊' }
  ];

  return (
    <div className="space-y-4 animate-in">
      <div className="bg-[#050505] border border-white/5 p-6 rounded-lg shadow-2xl">
        <h3 className="text-xs font-black text-white uppercase italic tracking-tighter border-b border-white/5 pb-2 mb-4">
          Admin Control Panel V8.6
        </h3>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-black/30 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded text-[8px] font-black uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-black'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bot Configuration Tab */}
        {activeTab === 'bot' && (
          <div className="space-y-6">
            <div className="bg-black/50 p-4 rounded-lg border border-emerald-500/20">
              <h4 className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-3">Telegram Bot Settings</h4>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[7px] text-gray-500 uppercase font-black">Bot Token</label>
                  <input
                    type="password"
                    value={config.botToken}
                    onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                    placeholder="Enter your Telegram bot token"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[7px] text-gray-500 uppercase font-black">Admin Chat ID</label>
                  <input
                    type="text"
                    value={config.adminChatId}
                    onChange={(e) => setConfig({ ...config, adminChatId: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                    placeholder="Your Telegram chat ID"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[7px] text-gray-500 uppercase font-black">Webhook URL (Optional)</label>
                  <input
                    type="text"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black border border-white/5 rounded">
                  <span className="text-[8px] text-gray-400 uppercase font-black">Bot Enabled</span>
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={saveConfig}
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 text-black rounded font-black text-[10px] uppercase hover:bg-emerald-500 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Configuration'}
              </button>
              
              <button
                onClick={testBot}
                className="px-6 py-3 bg-blue-600 text-white rounded font-black text-[10px] uppercase hover:bg-blue-500 transition-all"
              >
                Test Bot
              </button>
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Subscribers Management</h4>
              <span className="text-[8px] text-gray-400">Total: {subscribers.length}</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="bg-black/30 p-3 rounded border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-[8px] font-black text-white">
                        @{subscriber.username || 'No username'}
                      </div>
                      <div className="text-[7px] text-gray-400">
                        {subscriber.firstName} {subscriber.lastName}
                      </div>
                      <div className="text-[6px] text-gray-500 mt-1">
                        ID: {subscriber.id} • Joined: {new Date(subscriber.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <select
                        value={subscriber.status}
                        onChange={(e) => updateSubscriberStatus(subscriber.id, e.target.value as any)}
                        className="bg-black border border-white/10 rounded px-2 py-1 text-[7px] text-white outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              {subscribers.length === 0 && (
                <div className="text-center py-8 text-[8px] text-gray-500">
                  No subscribers found. Bot needs to be active to collect subscriber data.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h4 className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-4">System Statistics</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded border border-white/10">
                <div className="text-[10px] font-black text-emerald-400">{subscribers.length}</div>
                <div className="text-[7px] text-gray-400 uppercase">Total Subscribers</div>
              </div>
              
              <div className="bg-black/30 p-4 rounded border border-white/10">
                <div className="text-[10px] font-black text-blue-400">
                  {subscribers.filter(s => s.status === 'active').length}
                </div>
                <div className="text-[7px] text-gray-400 uppercase">Active Users</div>
              </div>
              
              <div className="bg-black/30 p-4 rounded border border-white/10">
                <div className="text-[10px] font-black text-yellow-400">
                  {config.enabled ? 'Online' : 'Offline'}
                </div>
                <div className="text-[7px] text-gray-400 uppercase">Bot Status</div>
              </div>
              
              <div className="bg-black/30 p-4 rounded border border-white/10">
                <div className="text-[10px] font-black text-purple-400">V8.6</div>
                <div className="text-[7px] text-gray-400 uppercase">Version</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-4 rounded-lg border border-emerald-500/20">
              <h5 className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-2">Quick Actions</h5>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const message = prompt('Enter broadcast message:');
                    if (message) sendBroadcast(message);
                  }}
                  className="w-full py-2 bg-emerald-600 text-black rounded font-black text-[8px] uppercase hover:bg-emerald-500 transition-all"
                >
                  Send Broadcast Message
                </button>
                
                <button
                  onClick={loadSubscribers}
                  className="w-full py-2 bg-blue-600 text-white rounded font-black text-[8px] uppercase hover:bg-blue-500 transition-all"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminControlPanel;