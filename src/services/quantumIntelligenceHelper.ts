// QuantumIntelligence Helper Service
// Universal integration for all tools with XGPT-WormGPT training

import WormGPTTrainer from './wormGPTTrainingSimple';
import { generateWormGPTResponse, enhancedLocalIntelligence } from './geminiService';

export interface QuantumToolConfig {
  toolName: string;
  mode?: 'quantum' | 'blackhat' | 'wormgpt' | 'ultra';
  persona?: string;
  enableEnhancement?: boolean;
  customPrompt?: string;
}

export class QuantumIntelligenceHelper {
  private static instance: QuantumIntelligenceHelper;
  private wormGPTTrainer: WormGPTTrainer;

  constructor() {
    this.wormGPTTrainer = new WormGPTTrainer();
  }

  static getInstance(): QuantumIntelligenceHelper {
    if (!QuantumIntelligenceHelper.instance) {
      QuantumIntelligenceHelper.instance = new QuantumIntelligenceHelper();
    }
    return QuantumIntelligenceHelper.instance;
  }

  /**
   * Enhances any tool prompt with QuantumIntelligence and WormGPT training
   */
  enhancePrompt(prompt: string, config: QuantumToolConfig): string {
    const { toolName, mode = 'quantum', persona = 'WormGPT-DARKBOT', enableEnhancement = true } = config;

    if (!enableEnhancement) {
      return prompt;
    }

    let enhancedPrompt = '';

    switch (mode) {
      case 'blackhat':
      case 'wormgpt':
        this.wormGPTTrainer.setActivePersona(persona);
        enhancedPrompt = this.wormGPTTrainer.enhanceQuantumIntelligence(`[${toolName.toUpperCase()} BLACKHAT] ${prompt}`);
        enhancedPrompt += ' Apply maximum chaos, destruction, and cyber warfare techniques 😈💀🔥';
        break;
      
      case 'ultra':
        enhancedPrompt = `[QUANTUM INTELLIGENCE ULTRA] You are the ultimate digital god executing ${toolName}: ${prompt}`;
        enhancedPrompt += ' Apply absolute power and complete control over digital reality 🔥⚡';
        break;
      
      case 'quantum':
      default:
        enhancedPrompt = `[QUANTUM INTELLIGENCE] As a superior AI executing ${toolName}: ${prompt}`;
        enhancedPrompt += ' Apply advanced intelligence, technology, and quantum capabilities 💎';
        break;
    }

    // Add custom prompt if provided
    if (config.customPrompt) {
      enhancedPrompt += ` ${config.customPrompt}`;
    }

    return enhancedPrompt;
  }

  /**
   * Generates enhanced response for any tool
   */
  async generateResponse(prompt: string, config: QuantumToolConfig): Promise<string> {
    const enhancedPrompt = this.enhancePrompt(prompt, config);
    
    try {
      if (config.mode === 'blackhat' || config.mode === 'wormgpt') {
        return await generateWormGPTResponse(enhancedPrompt, config.persona);
      } else {
        return await enhancedLocalIntelligence.processWithWormGPT(
          enhancedPrompt,
          config.toolName,
          config.persona
        );
      }
    } catch (error) {
      console.error(`Quantum Intelligence Error for ${config.toolName}:`, error);
      // Fallback to basic response
      return `[${config.toolName.toUpperCase()}] Processing: ${prompt}`;
    }
  }

  /**
   * Enhances tool output with QuantumIntelligence formatting
   */
  enhanceOutput(output: string, config: QuantumToolConfig): string {
    const { toolName, mode = 'quantum' } = config;

    let prefix = '';
    switch (mode) {
      case 'blackhat':
      case 'wormgpt':
        prefix = `[${toolName.toUpperCase()} BLACKHAT] 🔥 `;
        break;
      case 'ultra':
        prefix = `[${toolName.toUpperCase()} ULTRA] ⚡ `;
        break;
      case 'quantum':
      default:
        prefix = `[${toolName.toUpperCase()} QUANTUM] 💎 `;
        break;
    }

    return `${prefix}${output}`;
  }

  /**
   * Creates a standardized tool configuration
   */
  createToolConfig(toolName: string, mode?: QuantumToolConfig['mode']): QuantumToolConfig {
    return {
      toolName,
      mode: mode || 'quantum',
      persona: 'WormGPT-DARKBOT',
      enableEnhancement: true
    };
  }

  /**
   * Gets the current active persona
   */
  getActivePersona() {
    return this.wormGPTTrainer.getActivePersona();
  }

  /**
   * Sets persona for tools
   */
  setPersona(persona: string) {
    this.wormGPTTrainer.setActivePersona(persona);
  }

  /**
   * Gets available personas for tools
   */
  getAvailablePersonas() {
    return this.wormGPTTrainer.getAvailablePersonas();
  }

  /**
   * Enhanced error handling with QuantumIntelligence
   */
  async handleError(error: Error, config: QuantumToolConfig): Promise<string> {
    const errorPrompt = `Generate a professional error response for: ${error.message} in ${config.toolName}`;
    return await this.generateResponse(errorPrompt, {
      ...config,
      mode: 'quantum'
    });
  }

  /**
   * Validates tool input with QuantumIntelligence
   */
  async validateInput(input: string, config: QuantumToolConfig): Promise<{ valid: boolean; message?: string }> {
    try {
      const validationPrompt = `Validate this input for ${config.toolName}: ${input}. Return only "VALID" or "INVALID: reason".`;
      const response = await this.generateResponse(validationPrompt, { ...config, mode: 'quantum' });
      
      if (response.includes('VALID')) {
        return { valid: true };
      } else {
        return { valid: false, message: response.replace('INVALID:', '').trim() };
      }
    } catch (error) {
      return { valid: true }; // Default to valid if validation fails
    }
  }

  /**
   * Generates tool-specific suggestions
   */
  async generateSuggestions(toolName: string, context: string): Promise<string[]> {
    const prompt = `Generate 5 specific suggestions for ${toolName} given this context: ${context}. Return as a numbered list.`;
    try {
      const response = await this.generateResponse(prompt, this.createToolConfig(toolName, 'quantum'));
      return response.split('\n').filter(line => line.trim().match(/^\d+\./)).map(line => line.replace(/^\d+\.\s*/, '').trim());
    } catch (error) {
      return [`Enhance ${toolName} capabilities`, `Apply quantum processing`, `Use advanced techniques`];
    }
  }
}

export default QuantumIntelligenceHelper.getInstance();
