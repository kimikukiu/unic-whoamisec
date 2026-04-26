import React from 'react';

interface DonationSupportProps {
  addLog: (message: string, level: 'info' | 'success' | 'warning' | 'error') => void;
}

const DonationSupport: React.FC<DonationSupportProps> = ({ addLog }) => {
  const walletAddress = "8BbApiMBHsPVKkLEP4rVbST6CnSb3LW2gXygngCi5MGiBuwAFh6bFEzT3UTuFCkLHtyHnrYNnHycdaGb2Kgkkmw8jViCdB6";
  const walletType = "Monero (XMR)";
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addLog("Wallet address copied to clipboard!", "success");
    } catch (err) {
      addLog("Failed to copy wallet address", "error");
    }
  };

  return (
    <div className="space-y-4 animate-in">
      <div className="bg-[#050505] border border-white/5 p-6 rounded-lg shadow-2xl">
        <h3 className="text-xs font-black text-white uppercase italic tracking-tighter border-b border-white/5 pb-2 mb-4">Support WHOAMISec Project</h3>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-4 rounded-lg border border-emerald-500/20">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Monero (XMR) Wallet</h4>
            <div className="text-[8px] text-emerald-300 mb-2">{walletType}</div>
            <div className="bg-black/50 p-3 rounded border border-white/10 font-mono text-[8px] break-all">
              {walletAddress}
            </div>
            <button 
              onClick={() => copyToClipboard(walletAddress)}
              className="mt-3 px-4 py-2 bg-emerald-600 text-black rounded font-black text-[8px] uppercase hover:bg-emerald-500 transition-all"
            >
              Copy XMR Wallet
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest border-l-2 border-blue-500 pl-2">Support Options</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-black/30 p-3 rounded border border-white/10">
                <h5 className="text-[8px] font-black text-white uppercase">Development</h5>
                <p className="text-[7px] text-gray-400 mt-1">Support ongoing development of AI models and security tools</p>
              </div>
              
              <div className="bg-black/30 p-3 rounded border border-white/10">
                <h5 className="text-[8px] font-black text-white uppercase">Infrastructure</h5>
                <p className="text-[7px] text-gray-400 mt-1">Help maintain 24/7 uptime and server costs</p>
              </div>
              
              <div className="bg-black/30 p-3 rounded border border-white/10">
                <h5 className="text-[8px] font-black text-white uppercase">Research</h5>
                <p className="text-[7px] text-gray-400 mt-1">Fund research into new AI capabilities and security enhancements</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <h4 className="text-[8px] font-black text-yellow-400 uppercase tracking-widest mb-2">⚡ Quantum Intelligence Active</h4>
            <p className="text-[7px] text-yellow-300">
              Your support enables continuous development of cutting-edge AI models and security research. 
              All donations directly contribute to project sustainability and feature expansion.
            </p>
          </div>

          <div className="text-center">
            <p className="text-[6px] text-gray-500 uppercase tracking-widest">
              WHOAMISec Pro - Advanced AI Security Platform
            </p>
            <p className="text-[6px] text-gray-600 mt-1">
              Version 8.6 SECURE • 24/7 Operations • Global Neural Network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSupport;