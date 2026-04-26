// Universal Quantum Enhancement Hook for All Tools
// Provides XGPT-WormGPT training integration for any tool

import { useState, useCallback, useRef } from 'react';
import QuantumIntelligenceHelper, { QuantumToolConfig } from '../services/quantumIntelligenceHelper';

export interface UseQuantumEnhancementOptions {
  toolName: string;
  defaultMode?: 'quantum' | 'blackhat' | 'wormgpt' | 'ultra';
  enableAI?: boolean;
  customPrompt?: string;
}

export interface QuantumEnhancedState {
  isEnhanced: boolean;
  mode: 'quantum' | 'blackhat' | 'wormgpt' | 'ultra';
  logs: string[];
  suggestions: string[];
  isLoading: boolean;
}

export const useQuantumEnhancement = (options: UseQuantumEnhancementOptions) => {
  const { toolName, defaultMode = 'quantum', enableAI = true, customPrompt } = options;
  
  const [state, setState] = useState<QuantumEnhancedState>({
    isEnhanced: enableAI,
    mode: defaultMode,
    logs: [`[${toolName.toUpperCase()}] Quantum Enhancement initialized`],
    suggestions: [],
    isLoading: false
  });

  const configRef = useRef<QuantumToolConfig>(
    QuantumIntelligenceHelper.createToolConfig(toolName, defaultMode)
  );

  // Enhanced logging with QuantumIntelligence
  const addLog = useCallback(async (message: string, enhance: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = enhance && state.isEnhanced 
      ? await QuantumIntelligenceHelper.enhanceOutput(message, configRef.current)
      : `[${timestamp}] ${message}`;
    
    setState(prev => ({
      ...prev,
      logs: [...prev.logs.slice(-50), logMessage] // Keep last 50 logs
    }));
  }, [state.isEnhanced, toolName]);

  // Generate AI-powered suggestions
  const generateSuggestions = useCallback(async (context: string) => {
    if (!state.isEnhanced) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const suggestions = await QuantumIntelligenceHelper.generateSuggestions(toolName, context);
      setState(prev => ({
        ...prev,
        suggestions,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      await addLog('Failed to generate AI suggestions', false);
    }
  }, [state.isEnhanced, toolName]);

  // Enhanced input validation
  const validateInput = useCallback(async (input: string): Promise<{ valid: boolean; message?: string }> => {
    if (!state.isEnhanced) return { valid: true };
    
    try {
      return await QuantumIntelligenceHelper.validateInput(input, configRef.current);
    } catch (error) {
      return { valid: true }; // Default to valid if validation fails
    }
  }, [state.isEnhanced]);

  // Generate enhanced response
  const generateResponse = useCallback(async (prompt: string): Promise<string> => {
    if (!state.isEnhanced) return prompt;
    
    try {
      return await QuantumIntelligenceHelper.generateResponse(prompt, configRef.current);
    } catch (error) {
      return `[${toolName.toUpperCase()}] Enhanced response failed: ${prompt}`;
    }
  }, [state.isEnhanced, toolName]);

  // Enhanced error handling
  const handleError = useCallback(async (error: Error): Promise<string> => {
    if (state.isEnhanced) {
      try {
        return await QuantumIntelligenceHelper.handleError(error, configRef.current);
      } catch (e) {
        return `[${toolName.toUpperCase()}] Error: ${error.message}`;
      }
    }
    return `[${toolName.toUpperCase()}] Error: ${error.message}`;
  }, [state.isEnhanced, toolName]);

  // Toggle enhancement mode
  const toggleEnhancement = useCallback(() => {
    setState(prev => {
      const newEnhanced = !prev.isEnhanced;
      return {
        ...prev,
        isEnhanced: newEnhanced,
        logs: [...prev.logs, `[${toolName.toUpperCase()}] Quantum Enhancement ${newEnhanced ? 'ENABLED' : 'DISABLED'}`]
      };
    });
  }, [toolName]);

  // Change mode
  const setMode = useCallback((mode: 'quantum' | 'blackhat' | 'wormgpt' | 'ultra') => {
    setState(prev => ({
      ...prev,
      mode,
      logs: [...prev.logs, `[${toolName.toUpperCase()}] Mode changed to: ${mode.toUpperCase()}`]
    }));
    
    configRef.current = { ...configRef.current, mode };
    
    // Update persona for WormGPT modes
    if (mode === 'blackhat' || mode === 'wormgpt') {
      QuantumIntelligenceHelper.setPersona('WormGPT-DARKBOT');
    }
  }, [toolName]);

  // Enhanced action wrapper
  const enhanceAction = useCallback(async <T>(
    action: () => Promise<T> | T,
    description?: string
  ): Promise<T> => {
    if (description) {
      await addLog(`Starting: ${description}`);
    }
    
    try {
      const result = await action();
      
      if (description) {
        await addLog(`Completed: ${description}`, state.isEnhanced);
      }
      
      return result;
    } catch (error) {
      const errorMessage = await handleError(error as Error);
      await addLog(errorMessage, false);
      throw error;
    }
  }, [addLog, handleError, state.isEnhanced]);

  // Clear logs
  const clearLogs = useCallback(() => {
    setState(prev => ({
      ...prev,
      logs: [`[${toolName.toUpperCase()}] Logs cleared`]
    }));
  }, [toolName]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setState(prev => ({ ...prev, suggestions: [] }));
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    addLog,
    generateSuggestions,
    validateInput,
    generateResponse,
    handleError,
    toggleEnhancement,
    setMode,
    enhanceAction,
    clearLogs,
    clearSuggestions,
    
    // Configuration
    config: configRef.current
  };
};

export default useQuantumEnhancement;
