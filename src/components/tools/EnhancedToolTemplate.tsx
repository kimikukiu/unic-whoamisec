// Enhanced Tool Template with QuantumIntelligence Integration
// This template shows how to add XGPT-WormGPT training to any tool

import React, { useState, useEffect } from 'react';
import useQuantumEnhancement from '../../hooks/useQuantumEnhancement';

interface EnhancedToolProps {
  toolName: string;
  children: React.ReactNode;
  defaultMode?: 'quantum' | 'blackhat' | 'wormgpt' | 'ultra';
  showControls?: boolean;
}

export const EnhancedToolTemplate: React.FC<EnhancedToolProps> = ({
  toolName,
  children,
  defaultMode = 'quantum',
  showControls = true
}) => {
  const quantum = useQuantumEnhancement({
    toolName,
    defaultMode,
    enableAI: true
  });

  return (
    <div className={`enhanced-tool ${quantum.isEnhanced ? 'quantum-enhanced' : ''}`}>
      {/* Quantum Enhancement Controls */}
      {showControls && (
        <div className="quantum-controls bg-black/40 border border-cyan-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-cyan-400 font-bold text-sm">Quantum Intelligence</h3>
            <button
              onClick={quantum.toggleEnhancement}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                quantum.isEnhanced
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {quantum.isEnhanced ? 'ENHANCED' : 'NORMAL'}
            </button>
          </div>
          
          {quantum.isEnhanced && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-xs text-gray-400">Mode:</span>
                <select
                  value={quantum.mode}
                  onChange={(e) => quantum.setMode(e.target.value as any)}
                  className="bg-black/60 border border-cyan-500/30 rounded px-2 py-1 text-xs text-cyan-400"
                >
                  <option value="quantum">Quantum 💎</option>
                  <option value="blackhat">BlackHat 🔥</option>
                  <option value="wormgpt">WormGPT 😈</option>
                  <option value="ultra">Ultra ⚡</option>
                </select>
              </div>
              
              {quantum.suggestions.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-400 mb-1">AI Suggestions:</div>
                  <div className="space-y-1">
                    {quantum.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-cyan-300 bg-cyan-500/10 rounded p-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Tool Logs */}
      {quantum.logs.length > 0 && (
        <div className="quantum-logs bg-black/60 border border-cyan-500/20 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-cyan-400 font-bold text-xs">Enhanced Logs</h4>
            <button
              onClick={quantum.clearLogs}
              className="text-xs text-gray-400 hover:text-cyan-400"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1">
            {quantum.logs.map((log, index) => (
              <div key={index} className="text-xs text-cyan-300 font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Content */}
      <div className="tool-content">
        {children}
      </div>

      {/* Loading Indicator */}
      {quantum.isLoading && (
        <div className="quantum-loading fixed top-4 right-4 bg-cyan-500 text-black px-3 py-1 rounded text-xs font-bold animate-pulse">
          AI Processing...
        </div>
      )}

      <style jsx>{`
        .enhanced-tool.quantum-enhanced {
          position: relative;
        }
        
        .enhanced-tool.quantum-enhanced::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00bcd4, #ff00ff, #00bcd4);
          border-radius: inherit;
          z-index: -1;
          opacity: 0.3;
          animation: quantum-glow 3s ease-in-out infinite;
        }
        
        @keyframes quantum-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

// Hook for easy tool enhancement
export const useToolEnhancement = (toolName: string, defaultMode?: 'quantum' | 'blackhat' | 'wormgpt' | 'ultra') => {
  return useQuantumEnhancement({
    toolName,
    defaultMode,
    enableAI: true
  });
};

export default EnhancedToolTemplate;
