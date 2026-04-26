/**
 * GET /api/v1/providers
 * List available providers and their status
 */

import express from 'express';
import { providerManager } from '../providers/manager';
import { switchAIModel, getAvailableModels } from '../../services/geminiService';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const providers = await providerManager.getAvailableProviders();
    res.json({
      success: true,
      providers,
    });
  } catch (error) {
    console.error('[API v1 /providers] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

router.get('/models', async (req, res) => {
  try {
    const models = getAvailableModels();
    res.json({
      success: true,
      models,
      currentProvider: 'huggingface',
    });
  } catch (error) {
    console.error('[API v1 /providers/models] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

router.post('/models/switch', async (req, res) => {
  try {
    const { model } = req.body;
    
    if (!model) {
      return res.status(400).json({
        success: false,
        error: 'Model name is required',
      });
    }

    const availableModels = getAvailableModels();
    if (!availableModels.includes(model)) {
      return res.status(400).json({
        success: false,
        error: `Invalid model. Available models: ${availableModels.join(', ')}`,
      });
    }

    switchAIModel(model);
    
    res.json({
      success: true,
      message: `Switched to model: ${model}`,
      currentModel: model,
    });
  } catch (error) {
    console.error('[API v1 /providers/models/switch] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;
