import React, { useState } from 'react';
import { X, Key, Globe, Check, AlertCircle, Loader } from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'manage' | 'input';
  onSave?: (config: any) => void;
}

const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose, type, onSave }) => {
  const [selectedProvider, setSelectedProvider] = useState('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('nousresearch/hermes-3-llama-3.1-405b');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const providers = [
    { id: 'openrouter', name: 'OpenRouter', color: 'bg-blue-500' },
    { id: 'openai', name: 'OpenAI', color: 'bg-green-500' },
    { id: 'anthropic', name: 'Anthropic', color: 'bg-purple-500' },
    { id: 'gemini', name: 'Google Gemini', color: 'bg-yellow-500' },
    { id: 'mistral', name: 'Mistral', color: 'bg-orange-500' },
    { id: 'llama', name: 'Llama', color: 'bg-red-500' },
    { id: 'deepseek', name: 'DeepSeek', color: 'bg-cyan-500' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const config = {
      provider: selectedProvider,
      apiKey: apiKey,
      model: model,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('ai-config', JSON.stringify(config));
    
    if (onSave) {
      onSave(config);
    }
    
    setIsLoading(false);
    setTestResult('success');
    
    // Close after success
    setTimeout(() => {
      onClose();
      setTestResult(null);
    }, 2000);
  };

  const handleTest = async () => {
    setIsLoading(true);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTestResult(Math.random() > 0.3 ? 'success' : 'error');
    setIsLoading(false);
    
    setTimeout(() => setTestResult(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 border border-[#00ff41]/30 rounded-xl p-6 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00ff41]/20 rounded-lg flex items-center justify-center border border-[#00ff41]/50">
              {type === 'manage' ? <Globe className="w-5 h-5 text-[#00ff41]" /> : <Key className="w-5 h-5 text-[#00ff41]" />}
            </div>
            <div>
              <h2 className="text-[#00ff41] font-bold text-lg">
                {type === 'manage' ? 'API MANAGEMENT' : 'API INPUT'}
              </h2>
              <p className="text-[#00ff41]/70 text-sm">
                {type === 'manage' ? 'Manage your API configurations' : 'Configure new API keys'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'input' ? (
          /* API Input Interface */
          <div className="space-y-6">
            {/* Provider Selection */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded-lg p-4">
              <label className="text-xs text-[#00ff41]/70 block mb-3">SELECT PROVIDER</label>
              <div className="grid grid-cols-3 gap-2">
                {providers.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedProvider === provider.id
                        ? 'border-[#00ff41] bg-[#00ff41]/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-3 h-3 ${provider.color} rounded-full mx-auto mb-2`} />
                    <div className="text-xs text-white">{provider.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded-lg p-4">
              <label className="text-xs text-[#00ff41]/70 block mb-2">API KEY</label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="w-full bg-black/60 border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff41] transition-colors pr-12"
                />
                <Key className="absolute right-3 top-3.5 w-4 h-4 text-[#00ff41]/50" />
              </div>
            </div>

            {/* Model Configuration */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded-lg p-4">
              <label className="text-xs text-[#00ff41]/70 block mb-2">MODEL CONFIGURATION</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="nousresearch/hermes-3-llama-3.1-405b"
                className="w-full bg-black/60 border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff41] transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                disabled={isLoading || !apiKey}
                className="bg-gradient-to-r from-green-600/40 to-emerald-600/40 border-2 border-green-400 text-green-300 p-3 rounded-lg font-bold text-sm hover:from-green-500/50 hover:to-emerald-500/50 hover:border-green-300 hover:shadow-[0_0_20px_#10b981] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <span>💾</span>
                      <span>SAVE CONFIG</span>
                    </div>
                  </>
                )}
              </button>
              
              <button
                onClick={handleTest}
                disabled={isLoading || !apiKey}
                className="bg-gradient-to-r from-blue-600/40 to-cyan-600/40 border-2 border-blue-400 text-blue-300 p-3 rounded-lg font-bold text-sm hover:from-blue-500/50 hover:to-cyan-500/50 hover:border-blue-300 hover:shadow-[0_0_20px_#3b82f6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <span>🧪</span>
                      <span>TEST API</span>
                    </div>
                  </>
                )}
              </button>
            </div>

            {/* Status Display */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#00ff41]/70">STATUS</span>
                <div className="flex items-center gap-2">
                  {testResult === 'success' ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">CONNECTION SUCCESSFUL</span>
                    </>
                  ) : testResult === 'error' ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400">CONNECTION FAILED</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">READY</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* API Management Interface */
          <div className="space-y-6">
            <div className="bg-black/40 border border-[#00ff41]/20 rounded-lg p-4">
              <h3 className="text-[#00ff41] font-bold text-sm mb-3">CONFIGURED APIS</h3>
              <div className="space-y-2">
                {providers.map(provider => (
                  <div key={provider.id} className="flex items-center justify-between p-3 bg-black/60 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${provider.color} rounded-full`} />
                      <span className="text-white text-sm">{provider.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 border border-[#00ff41]/20 rounded-lg p-4">
              <h3 className="text-[#00ff41] font-bold text-sm mb-3">QUANTUM INTELLIGENCE STATUS</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Primary Provider:</span>
                  <span className="text-[#00ff41]">OpenRouter</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Model:</span>
                  <span className="text-[#00ff41]">hermes-3-llama-3.1-405b</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">Connected</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Last Sync:</span>
                  <span className="text-[#00ff41]">2 minutes ago</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // Switch to input mode
                onClose();
                setTimeout(() => {
                  // Reopen with input type
                }, 100);
              }}
              className="w-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 border-2 border-purple-400 text-purple-300 p-3 rounded-lg font-bold text-sm hover:from-purple-500/50 hover:to-blue-500/50 hover:border-purple-300 hover:shadow-[0_0_20px_#a855f7] transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <span>➕</span>
                <span>ADD NEW API CONFIGURATION</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiConfigModal;
