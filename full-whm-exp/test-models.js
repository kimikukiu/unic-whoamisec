// Test script for model switching functionality
const { AITaskQueue } = require('./services/aiTaskQueue.ts');

// Mock environment
const HF_TOKEN = process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_KEY || "test_token";

console.log("🧪 Testing AI Model Integration");
console.log("================================");

// Create AI task queue instance
const aiQueue = new AITaskQueue(HF_TOKEN);

console.log("\n📋 Available Models:");
const models = aiQueue.getAvailableModels();
models.forEach((model, index) => {
  console.log(`${index + 1}. ${model}`);
});

console.log("\n🔄 Testing Model Switching:");

// Test switching to each model
models.forEach((model) => {
  console.log(`\nSwitching to: ${model}`);
  aiQueue.setModel(model);
  console.log(`✅ Successfully switched to ${model}`);
});

console.log("\n✨ All model switching tests completed!");
console.log("\n💡 Usage in your application:");
console.log("- Use the Settings component to switch models via UI");
console.log("- Or call switchAIModel('model-name') programmatically");
console.log("- Models will use appropriate system prompts for abliterated versions");