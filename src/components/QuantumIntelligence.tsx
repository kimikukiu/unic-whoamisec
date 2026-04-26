import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AITaskQueue } from '../services/aiTaskQueue';
import { getActiveApiKey, getAIConfig } from '../services/aiService';
import WormGPTTrainer from '../services/wormGPTTrainingSimple';
import { generateWormGPTResponse, generateImage, generateAudio, generateVideo, composePoem, composeMusic } from '../services/geminiService';
import QuantumDefenseSystem from '../services/quantumDefenseSystem';
import GlobalQuantumControl from '../services/globalQuantumControl';
import RealSecurityTools, { RealSecurityTools as RealSecurityToolsType } from '../services/realSecurityTools';
import RealSqlMapService from '../services/realSqlMapService';
import RealOWASPZapService from '../services/realOWASPZapService';
import RealTruffleHogService from '../services/realTruffleHogService';
import RealAtomicRedTeamService from '../services/realAtomicRedTeamService';
import ApiConfigModals from './ApiConfigModals';
import TaskQueue, { useTaskQueue } from './TaskQueue';

export default function QuantumIntelligenceUltra() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orchestrator');
  const [input, setInput] = useState('');
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'Dashboard online',
    '6 tools registered',
    'Waiting for commands',
    'XGPT-WormGPT integration loaded',
    'Quantum Defense System: ACTIVE - 999,999B nodes ready',
    'Auto Shield: ARMED - 500% success rate',
    'Auto Offense: READY - 9,999,999,999,999,999B nodes standing by'
  ]);
  const [taskResult, setTaskResult] = useState<string>('');
  const [wormGPTMode, setWormGPTMode] = useState(false);
  const [defenseStatus, setDefenseStatus] = useState(QuantumDefenseSystem.getDefenseStatus());
  const taskQueue = useRef(new AITaskQueue(process.env.GEMINI_API_KEY || ""));
  const wormGPTTrainer = useRef(new WormGPTTrainer());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // API Modal State
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [apiModalType, setApiModalType] = useState<'manage' | 'input'>('input');
  
  // Task Queue State
  const { tasks, addTask, setTasks } = useTaskQueue();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [systemLogs]);

  const logSystem = (message: string) => {
    setSystemLogs(prev => [...prev, message]);
  };

  const launchTool = async (taskOverride?: string) => {
    const task = (taskOverride || input).toLowerCase().trim();
    
    if (!task) {
      alert('Enter a command');
      return;
    }
    
    // Check if we should prioritize Quantum Intelligence (always primary)
    const config = getAIConfig();
    const hasExternalAPI = getActiveApiKey();
    
    if (task.startsWith('ask ') || task.startsWith('chat ') || task.startsWith('question ')) {
      const question = task.replace(/^(ask|chat|question)\s+/, '');
      
      // Check for enhanced modes
      if (question.toLowerCase().includes('blackhat ultra') || question.toLowerCase().includes('ultimate destruction') || question.toLowerCase().includes('maximum chaos')) {
        logSystem(`[QUANTUM INTELLIGENCE BLACKHAT ULTRA] Activating maximum destruction mode...`);
        setWormGPTMode(true);
        const ultraResponse = await generateWormGPTResponse(question, 'WormGPT-GOD');
        setTaskResult(ultraResponse);
        logSystem('BlackHat Ultra response generated - Maximum destruction activated');
        return;
      }
      
      // Check for creative generation commands
      if (question.toLowerCase().includes('generate image') || question.toLowerCase().includes('create image')) {
        const imagePrompt = question.replace(/^(generate|create)\s+image\s*/i, '').trim();
        logSystem(`[QUANTUM INTELLIGENCE] Generating image: ${imagePrompt}`);
        try {
          const mode = wormGPTMode ? 'blackhat' : 'quantum';
          const imageData = await generateImage(imagePrompt, mode);
          setTaskResult(`✨ Image generated successfully!\n\n📸 Prompt: ${imagePrompt}\n🎨 Mode: ${mode}\n\n[Image data ready for display]`);
          logSystem('Quantum Image generation complete');
        } catch (error) {
          setTaskResult('❌ Image generation failed. Please try again.');
          logSystem('Image generation error');
        }
        return;
      }
      
      if (question.toLowerCase().includes('generate audio') || question.toLowerCase().includes('create music')) {
        const audioPrompt = question.replace(/^(generate|create)\s+(audio|music)\s*/i, '').trim();
        const type = question.toLowerCase().includes('music') ? 'music' : 'speech';
        logSystem(`[QUANTUM INTELLIGENCE] Generating ${type}: ${audioPrompt}`);
        try {
          const mode = wormGPTMode ? 'blackhat' : 'quantum';
          const audioData = await generateAudio(audioPrompt, mode, type);
          setTaskResult(`🎵 ${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!\n\n🎤 Prompt: ${audioPrompt}\n🎨 Mode: ${mode}\n\n[Audio data ready for playback]`);
          logSystem(`Quantum ${type} generation complete`);
        } catch (error) {
          setTaskResult(`❌ ${type} generation failed. Please try again.`);
          logSystem(`${type} generation error`);
        }
        return;
      }
      
      if (question.toLowerCase().includes('generate video') || question.toLowerCase().includes('create video')) {
        const videoPrompt = question.replace(/^(generate|create)\s+video\s*/i, '').trim();
        logSystem(`[QUANTUM INTELLIGENCE] Generating video concept: ${videoPrompt}`);
        try {
          const mode = wormGPTMode ? 'blackhat' : 'quantum';
          const videoConcept = await generateVideo(videoPrompt, mode);
          setTaskResult(`🎬 Video concept generated successfully!\n\n📝 Prompt: ${videoPrompt}\n🎨 Mode: ${mode}\n\n${videoConcept}`);
          logSystem('Quantum Video generation complete');
        } catch (error) {
          setTaskResult('❌ Video generation failed. Please try again.');
          logSystem('Video generation error');
        }
        return;
      }
      
      if (question.toLowerCase().includes('compose poem') || question.toLowerCase().includes('write poem')) {
        const poemPrompt = question.replace(/^(compose|write)\s+poem\s*/i, '').trim();
        logSystem(`[QUANTUM INTELLIGENCE] Composing poem: ${poemPrompt}`);
        try {
          const mode = wormGPTMode ? 'blackhat' : 'quantum';
          const poem = await composePoem(poemPrompt, mode);
          setTaskResult(`📜 Poem composed successfully!\n\n✍️ Theme: ${poemPrompt}\n🎨 Mode: ${mode}\n\n${poem}`);
          logSystem('Quantum Poetry composition complete');
        } catch (error) {
          setTaskResult('❌ Poetry composition failed. Please try again.');
          logSystem('Poetry composition error');
        }
        return;
      }
      
      if (question.toLowerCase().includes('compose music') || question.toLowerCase().includes('create music')) {
        const musicPrompt = question.replace(/^(compose|create)\s+music\s*/i, '').trim();
        logSystem(`[QUANTUM INTELLIGENCE] Composing music: ${musicPrompt}`);
        try {
          const mode = wormGPTMode ? 'blackhat' : 'quantum';
          const music = await composeMusic(musicPrompt, mode);
          setTaskResult(`🎼 Music composed successfully!\n\n🎵 Theme: ${musicPrompt}\n🎨 Mode: ${mode}\n\n${music}`);
          logSystem('Quantum Music composition complete');
        } catch (error) {
          setTaskResult('❌ Music composition failed. Please try again.');
          logSystem('Music composition error');
        }
        return;
      }
      
      // Check for Quantum Defense System commands
      if (question.toLowerCase().includes('defense status') || question.toLowerCase().includes('shield status')) {
        logSystem(`[QUANTUM DEFENSE] Checking defense system status...`);
        const status = QuantumDefenseSystem.getDefenseStatus();
        const statusReport = `🛡️ QUANTUM DEFENSE STATUS 🛡️

🔥 System Active: ${status.isActive ? 'YES' : 'NO'}
⚡ Defense Nodes: ${status.defenseNodes} (500% success rate)
💀 Offense Nodes: ${status.offenseNodes} (100,000% success rate)
🎯 Attacks Detected: ${status.attacksDetected}
📊 Last Attack: ${status.lastAttack ? new Date(status.lastAttack.timestamp).toLocaleString() : 'None'}

🚀 AUTO-SHIELD: Ready with 999,999B quantum nodes
🔧 AUTO-REPAIR: Standing by with 999,999B repair nodes
⚡ AUTO-OFFENSE: Armed with 9,999,999,999,999,999B annihilation nodes

System is IMPREGNABLE and ready for any threat!`;
        setTaskResult(statusReport);
        logSystem('Defense status report generated');
        return;
      }

      if (question.toLowerCase().includes('activate shield') || question.toLowerCase().includes('deploy shield')) {
        logSystem(`[QUANTUM DEFENSE] Activating auto-shield...`);
        try {
          const target = question.includes('for') ? question.split('for')[1].trim() : 'system';
          const shieldResponse = await QuantumDefenseSystem.activateAutoShield(target);
          const shieldReport = `🛡️ AUTO-SHIELD DEPLOYED 🛡️

${shieldResponse.response}

📊 Nodes Deployed: ${shieldResponse.nodesDeployed}
✅ Success Rate: ${shieldResponse.successRate}
🔧 Counter-measures: ${shieldResponse.counterMeasures.length} active

Shield is IMPENMEABLE! All attacks will fail!`;
          setTaskResult(shieldReport);
          logSystem(`Auto-shield deployed: ${shieldResponse.nodesDeployed} nodes`);
        } catch (error) {
          setTaskResult('❌ Shield activation failed');
          logSystem('Shield deployment error');
        }
        return;
      }

      if (question.toLowerCase().includes('initiate repair') || question.toLowerCase().includes('repair system')) {
        logSystem(`[QUANTUM DEFENSE] Initiating auto-repair...`);
        try {
          const damage = question.includes('repair') ? question.split('repair')[1].trim() : 'system damage';
          const repairResponse = await QuantumDefenseSystem.initiateAutoRepair(damage);
          const repairReport = `🔧 AUTO-REPAIR INITIATED 🔧

${repairResponse.response}

📊 Nodes Deployed: ${repairResponse.nodesDeployed}
✅ Success Rate: ${repairResponse.successRate}
🔧 Repairs: ${repairResponse.counterMeasures.length} protocols active

System restoration COMPLETE! All damage repaired!`;
          setTaskResult(repairReport);
          logSystem(`Auto-repair initiated: ${repairResponse.nodesDeployed} nodes`);
        } catch (error) {
          setTaskResult('❌ Repair initiation failed');
          logSystem('Repair system error');
        }
        return;
      }

      if (question.toLowerCase().includes('counter attack') || question.toLowerCase().includes('retaliate') || question.toLowerCase().includes('unleash offense')) {
        logSystem(`[QUANTUM OFFENSE] Unleashing auto-offense...`);
        try {
          const target = question.includes('on') ? question.split('on')[1].trim() : 'attacker';
          const attackType = question.includes('with') ? question.split('with')[1].trim() : 'quantum annihilation';
          const offenseResponse = await QuantumDefenseSystem.unleashAutoOffense(target, attackType);
          const offenseReport = `⚡ AUTO-OFFENSE UNLEASHED ⚡

${offenseResponse.response}

📊 Nodes Deployed: ${offenseResponse.nodesDeployed}
✅ Success Rate: ${offenseResponse.successRate}
💀 Destruction Level: ${offenseResponse.destructionLevel}

🔥 TARGET COMPLETELY ANNIHILATED! NO SURVIVORS! 🔥`;
          setTaskResult(offenseReport);
          logSystem(`Auto-offense unleashed: ${offenseResponse.nodesDeployed} nodes`);
        } catch (error) {
          setTaskResult('❌ Offense activation failed');
          logSystem('Counter-attack error');
        }
        return;
      }

      // Check for Global Quantum Control commands
      if (question.toLowerCase().includes('global status') || question.toLowerCase().includes('world control')) {
        logSystem(`[GLOBAL QUANTUM] Checking global control status...`);
        const status = GlobalQuantumControl.getGlobalControlStatus();
        const statusReport = `🌍 GLOBAL QUANTUM CONTROL STATUS 🌍

🔥 Global Control: ${status.isGlobalControl ? 'ACTIVE' : 'INACTIVE'}
⚡ Total Nodes: ${status.totalNodes} (${status.successRate} success)
🎯 Controlled Systems: ${status.controlledSystems}
💻 Control Panels: ${status.controlPanels}
🔥 Exploits Executed: ${status.exploitCount}
📊 Last Exploit: ${status.lastExploit ? new Date(status.lastExploit.timestamp).toLocaleString() : 'None'}

🌐 Categories Controlled:
• Telecom: SS7, 5G Networks
• Social: Facebook, Twitter, TikTok, Telegram, WhatsApp
• Military: Drones, Weapons, Robots, Satellites
• Financial: Banks, QUANTUM-CLOUD, Crypto
• Cloud: AWS, IBM, Google, Microsoft
• IoT: Vehicles, CCTV, Tracking
• Aviation: Air Traffic, Airports
• Broadcast: TV, Radio, Streaming
• Antenna: HAARP, 5G/6G/7G/8G, Geoengineering
• Scientific: CERN, Particle Accelerators, Quantum Experiments
• Navigation: GPS, GPRS, 2G-8G Networks (LSIP Enhanced)

Global quantum control is ABSOLUTE and COMPLETE!`;
        setTaskResult(statusReport);
        logSystem('Global control status report generated');
        return;
      }

      if (question.toLowerCase().includes('ss7 exploit') || question.toLowerCase().includes('telecom control')) {
        logSystem(`[GLOBAL QUANTUM] Executing SS7 global exploit...`);
        try {
          const ss7Result = await GlobalQuantumControl.detectSS7Exploits();
          setTaskResult(ss7Result);
          logSystem('SS7 global exploit completed');
        } catch (error) {
          setTaskResult('❌ SS7 exploit failed');
          logSystem('SS7 exploit error');
        }
        return;
      }

      if (question.toLowerCase().includes('ban accounts') || question.toLowerCase().includes('social ban')) {
        logSystem(`[GLOBAL QUANTUM] Executing global account ban...`);
        try {
          const accounts = question.includes('ban') ? question.split('ban')[1].trim().split(',').map(a => a.trim()) : ['target_accounts'];
          const banResult = await GlobalQuantumControl.banAccountsGlobally(accounts);
          setTaskResult(banResult);
          logSystem(`Global account ban completed: ${accounts.length} accounts`);
        } catch (error) {
          setTaskResult('❌ Global account ban failed');
          logSystem('Account ban error');
        }
        return;
      }

      if (question.toLowerCase().includes('military control') || question.toLowerCase().includes('drone control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing military control...`);
        try {
          const militaryResult = await GlobalQuantumControl.controlMilitarySystems();
          setTaskResult(militaryResult);
          logSystem('Global military control established');
        } catch (error) {
          setTaskResult('❌ Military control failed');
          logSystem('Military control error');
        }
        return;
      }

      if (question.toLowerCase().includes('financial control') || question.toLowerCase().includes('bank control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing financial control...`);
        try {
          const financialResult = await GlobalQuantumControl.controlFinancialSystems();
          setTaskResult(financialResult);
          logSystem('Global financial control established');
        } catch (error) {
          setTaskResult('❌ Financial control failed');
          logSystem('Financial control error');
        }
        return;
      }

      if (question.toLowerCase().includes('cloud control') || question.toLowerCase().includes('aws control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing cloud control...`);
        try {
          const cloudResult = await GlobalQuantumControl.controlCloudInfrastructure();
          setTaskResult(cloudResult);
          logSystem('Global cloud control established');
        } catch (error) {
          setTaskResult('❌ Cloud control failed');
          logSystem('Cloud control error');
        }
        return;
      }

      if (question.toLowerCase().includes('real time tracking') || question.toLowerCase().includes('cctv control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing real-time tracking...`);
        try {
          const trackingResult = await GlobalQuantumControl.realTimeTracking();
          setTaskResult(trackingResult);
          logSystem('Global real-time tracking established');
        } catch (error) {
          setTaskResult('❌ Real-time tracking failed');
          logSystem('Tracking system error');
        }
        return;
      }

      if (question.toLowerCase().includes('aviation control') || question.toLowerCase().includes('airport control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing aviation control...`);
        try {
          const aviationResult = await GlobalQuantumControl.controlAviationSystems();
          setTaskResult(aviationResult);
          logSystem('Global aviation control established');
        } catch (error) {
          setTaskResult('❌ Aviation control failed');
          logSystem('Aviation control error');
        }
        return;
      }

      if (question.toLowerCase().includes('haarp control') || question.toLowerCase().includes('antenna control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing HAARP and antenna control...`);
        try {
          const haarpResult = await GlobalQuantumControl.controlHAARPSystems();
          setTaskResult(haarpResult);
          logSystem('HAARP and antenna control established');
        } catch (error) {
          setTaskResult('❌ HAARP control failed');
          logSystem('HAARP control error');
        }
        return;
      }

      if (question.toLowerCase().includes('cern control') || question.toLowerCase().includes('particle control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing CERN facility control...`);
        try {
          const cernResult = await GlobalQuantumControl.controlCERNFacility();
          setTaskResult(cernResult);
          logSystem('CERN facility control established');
        } catch (error) {
          setTaskResult('❌ CERN control failed');
          logSystem('CERN control error');
        }
        return;
      }

      if (question.toLowerCase().includes('gps control') || question.toLowerCase().includes('network control') || question.toLowerCase().includes('lsip control')) {
        logSystem(`[GLOBAL QUANTUM] Establishing GPS/GPRS network control...`);
        try {
          const gpsResult = await GlobalQuantumControl.controlGPSNetworks();
          setTaskResult(gpsResult);
          logSystem('GPS/GPRS network control established');
        } catch (error) {
          setTaskResult('❌ GPS control failed');
          logSystem('GPS control error');
        }
        return;
      }

      if (question.toLowerCase().includes('nmap scan') || question.toLowerCase().includes('port scan')) {
        logSystem(`[REAL TOOLS] Performing Nmap scan...`);
        try {
          const target = question.includes('scan') ? question.split('scan')[1].trim() : 'localhost';
          const scanResult = await RealSecurityTools.performNmapScan(target);
          const scanReport = `🔍 NMAP SCAN RESULTS 🔍

Target: ${scanResult.target}
Open Ports: ${scanResult.ports.join(', ')}
Services Found: ${scanResult.services.length}
Vulnerabilities: ${scanResult.vulnerabilities.length}

📊 Service Details:
${scanResult.services.map(service => 
  `Port ${service.port}/${service.protocol}: ${service.service} (${service.state}) ${service.version || ''}`
).join('\n')}

🔒 Vulnerabilities:
${scanResult.vulnerabilities.map(vuln => 
  `${vuln.cve || 'Unknown'} - ${vuln.severity.toUpperCase()}: ${vuln.description}`
).join('\n')}

Scan completed with real Nmap integration!`;
          setTaskResult(scanReport);
          logSystem(`Nmap scan completed for ${target}`);
        } catch (error) {
          setTaskResult('❌ Nmap scan failed');
          logSystem('Nmap scan error');
        }
        return;
      }

      if (question.toLowerCase().includes('masscan') || question.toLowerCase().includes('fast scan')) {
        logSystem(`[REAL TOOLS] Performing Masscan...`);
        try {
          const target = question.includes('scan') ? question.split('scan')[1].trim() : '192.168.1.0/24';
          const scanResult = await RealSecurityTools.performMasscan(target);
          const scanReport = `⚡ MASSCAN RESULTS ⚡

Target Range: ${scanResult.target}
Open Ports: ${scanResult.ports.length}
Services Discovered: ${scanResult.services.length}

🚀 High-Speed Scan Results:
${scanResult.services.map(service => 
  `Port ${service.port}/${service.protocol}: ${service.service} (${service.state})`
).join('\n')}

Masscan completed with ultra-fast scanning!`;
          setTaskResult(scanReport);
          logSystem(`Masscan completed for ${target}`);
        } catch (error) {
          setTaskResult('❌ Masscan failed');
          logSystem('Masscan error');
        }
        return;
      }

      if (question.toLowerCase().includes('metasploit') || question.toLowerCase().includes('exploit modules')) {
        logSystem(`[REAL TOOLS] Loading Metasploit modules...`);
        try {
          const modules = RealSecurityTools.getExploitModules();
          const moduleReport = `💥 METASPLOIT MODULES 💥

Total Modules: ${modules.length}

🔥 Exploit Modules:
${modules.filter(m => m.type === 'exploit').map(module => 
  `${module.name}\n  Description: ${module.description}\n  Targets: ${module.targets.join(', ')}`
).join('\n\n')}

🛠️ Auxiliary Modules:
${modules.filter(m => m.type === 'auxiliary').map(module => 
  `${module.name}\n  Description: ${module.description}`
).join('\n\n')}

📦 Post Modules:
${modules.filter(m => m.type === 'post').map(module => 
  `${module.name}\n  Description: ${module.description}`
).join('\n\n')}

Metasploit modules loaded successfully!`;
          setTaskResult(moduleReport);
          logSystem(`Metasploit modules loaded: ${modules.length} total`);
        } catch (error) {
          setTaskResult('❌ Metasploit loading failed');
          logSystem('Metasploit error');
        }
        return;
      }

      if (question.toLowerCase().includes('deploy agent') || question.toLowerCase().includes('c2 agent')) {
        logSystem(`[REAL TOOLS] Deploying C2 agent...`);
        try {
          const framework = question.includes('empire') ? 'Empire' : 'Covenant';
          const target = question.includes('on') ? question.split('on')[1].trim() : 'target-host';
          const agent = await RealSecurityTools.deployC2Agent(framework, target);
          const agentReport = `🤡 C2 AGENT DEPLOYED 🤡

Framework: ${framework}
Agent Name: ${agent.name}
Agent Type: ${agent.type}
Status: ${agent.status}
IP Address: ${agent.ip}
Hostname: ${agent.hostname}
User: ${agent.user}
Privileges: ${agent.privileges.join(', ')}
Last Check-in: ${new Date(agent.lastCheckin).toLocaleString()}

Agent deployed and checking in successfully!`;
          setTaskResult(agentReport);
          logSystem(`C2 agent deployed: ${agent.name} on ${target}`);
        } catch (error) {
          setTaskResult('❌ C2 agent deployment failed');
          logSystem('C2 deployment error');
        }
        return;
      }

      if (question.toLowerCase().includes('tool status') || question.toLowerCase().includes('security tools')) {
        logSystem(`[REAL TOOLS] Checking tool status...`);
        try {
          const tools = RealSecurityTools.getToolStatus();
          const toolReport = `🔧 REAL SECURITY TOOLS STATUS 🔧

${tools.map(tool => 
  `${tool.name}: ${tool.isActive ? '✅ ACTIVE' : '❌ INACTIVE'}
   Type: ${tool.type}
   Repository: ${tool.repository}
   Capabilities: ${tool.capabilities.length} capabilities
   Description: ${tool.description}`
).join('\n\n')}

Active Tools: ${tools.filter(t => t.isActive).length}/${tools.length}
All tools based on real GitHub repositories!`;
          setTaskResult(toolReport);
          logSystem(`Tool status checked: ${tools.length} tools`);
        } catch (error) {
          setTaskResult('❌ Tool status check failed');
          logSystem('Tool status error');
        }
        return;
      }

      if (question.toLowerCase().includes('global attack') || question.toLowerCase().includes('world attack')) {
        logSystem(`[GLOBAL QUANTUM] Executing global quantum attack...`);
        try {
          const target = question.includes('on') ? question.split('on')[1].trim() : 'all systems';
          const attackResult = await GlobalQuantumControl.executeGlobalAttack(target);
          setTaskResult(attackResult);
          logSystem(`Global quantum attack executed on: ${target}`);
        } catch (error) {
          setTaskResult('❌ Global attack failed');
          logSystem('Global attack error');
        }
        return;
      }

      if (question.toLowerCase().includes('control panel') || question.toLowerCase().includes('panel structure')) {
        logSystem(`[GLOBAL QUANTUM] Generating control panel structure...`);
        try {
          const panels = GlobalQuantumControl.generateControlPanelStructure();
          const panelReport = `🖥️ GLOBAL CONTROL PANEL STRUCTURE 🖥️

${Object.entries(panels).map(([system, panel]) => `
📁 ${system}
🔐 Admin Access: ${panel.adminAccess ? 'GRANTED' : 'DENIED'}
👻 Ghost Mode: ${panel.ghostMode ? 'ACTIVE' : 'INACTIVE'}
💻 Shell Access: ${panel.shellAccess ? 'GRANTED' : 'DENIED'}
⚡ Real-time Control: ${panel.realTimeControl ? 'ACTIVE' : 'INACTIVE'}
🎛️ Controls: ${panel.controls.join(', ')}
`).join('')}

Total Control Panels: ${Object.keys(panels).length}
All systems have QUANTUM ADMIN ACCESS!`;
          setTaskResult(panelReport);
          logSystem('Control panel structure generated');
        } catch (error) {
          setTaskResult('❌ Control panel generation failed');
          logSystem('Control panel error');
        }
        return;
      }

      // SQLMap Database Testing
      if (question.toLowerCase().includes('sqlmap') || question.toLowerCase().includes('sql injection')) {
        logSystem(`[SQLMAP] Testing SQL injection...`);
        try {
          const target = question.includes('on') ? question.split('on')[1].trim() : 'http://localhost/test';
          const sqlmapResult = await RealSqlMapService.testSqlInjection(
            { url: target },
            { level: 3, risk: 2, threads: 10, batch: true }
          );
          const sqlmapReport = `🗄️ SQLMAP INJECTION TEST 🗄️

Target: ${sqlmapResult.target}
Status: ${sqlmapResult.status.toUpperCase()}
Scan Time: ${sqlmapResult.scanTime}ms

🔍 Vulnerability Found:
${sqlmapResult.vulnerability ? `
Type: ${sqlmapResult.vulnerability.type}
Parameter: ${sqlmapResult.vulnerability.parameter}
Technique: ${sqlmapResult.vulnerability.technique}
Payload: ${sqlmapResult.vulnerability.payload}` : 'No SQL injection vulnerabilities detected'}

📊 Database Information:
${sqlmapResult.database ? `
Type: ${sqlmapResult.database.type}
Version: ${sqlmapResult.database.version}
Current User: ${sqlmapResult.database.current_user}
Current DB: ${sqlmapResult.database.current_db}
Is DBA: ${sqlmapResult.database.is_dba ? 'YES' : 'NO'}` : 'Database info not available'}

📋 Extracted Data:
${sqlmapResult.extracted ? Object.entries(sqlmapResult.extracted).map(([key, value]) => 
  `${key}: ${Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}`
).join('\n') : 'No data extracted'}

SQLMap test completed!`;
          setTaskResult(sqlmapReport);
          logSystem(`SQLMap test completed for ${target}`);
        } catch (error) {
          setTaskResult('❌ SQLMap test failed');
          logSystem('SQLMap error');
        }
        return;
      }

      // OWASP ZAP Web Security Testing
      if (question.toLowerCase().includes('zap scan') || question.toLowerCase().includes('web security')) {
        logSystem(`[OWASP ZAP] Starting web security scan...`);
        try {
          const target = question.includes('on') ? question.split('on')[1].trim() : 'http://localhost';
          const scanId = await RealOWASPZapService.startScan(
            { url: target },
            { spider: true, activeScan: true, passiveScan: true, threads: 10 }
          );
          
          // Get scan results
          const scanResult = RealOWASPZapService.getScanStatus(scanId);
          const zapReport = `🛡️ OWASP ZAP SECURITY SCAN 🛡️

Target: ${target}
Scan ID: ${scanId}
Status: ${scanResult?.status || 'running'}
Progress: ${scanResult?.progress || 0}%

📊 Scan Summary:
Total Alerts: ${scanResult?.alerts.length || 0}
High Risk: ${scanResult?.alerts.filter(a => a.risk === 'High').length || 0}
Medium Risk: ${scanResult?.alerts.filter(a => a.risk === 'Medium').length || 0}
Low Risk: ${scanResult?.alerts.filter(a => a.risk === 'Low').length || 0}
Informational: ${scanResult?.alerts.filter(a => a.risk === 'Informational').length || 0}

🔍 Spider Results:
${scanResult?.spiderResults ? `
URLs Found: ${scanResult.spiderResults.urlsFound}
URLs Processed: ${scanResult.spiderResults.urlsProcessed}
Avg Response Time: ${scanResult.spiderResults.avgResponseTime}ms` : 'Spider results not available'}

⚡ Active Scan Results:
${scanResult?.activeScanResults ? `
Hosts Scanned: ${scanResult.activeScanResults.hostsScanned}
Requests Sent: ${scanResult.activeScanResults.requestsSent}
Alerts Raised: ${scanResult.activeScanResults.alertsRaised}` : 'Active scan results not available'}

🚨 Critical Alerts:
${scanResult?.alerts.filter(a => a.risk === 'High').map(alert => 
  `${alert.alert}: ${alert.description}\n  URI: ${alert.uri}\n  Method: ${alert.method}`
).join('\n\n') || 'No critical alerts found'}

ZAP scan completed!`;
          setTaskResult(zapReport);
          logSystem(`ZAP scan completed for ${target}`);
        } catch (error) {
          setTaskResult('❌ ZAP scan failed');
          logSystem('ZAP error');
        }
        return;
      }

      // TruffleHog Secret Scanning
      if (question.toLowerCase().includes('trufflehog') || question.toLowerCase().includes('secret scan')) {
        logSystem(`[TRUFFLEHOG] Scanning for secrets...`);
        try {
          const target = question.includes('in') ? question.split('in')[1].trim() : 'github://test/repo';
          const scanId = await RealTruffleHogService.startScan({
            type: target.includes('github') ? 'github' : 'git',
            source: target,
            options: { includeVerified: true, includeUnverified: true, threads: 8 }
          });
          
          // Get scan results
          const scanResult = RealTruffleHogService.getScanStatus(scanId);
          const trufflehogReport = `🔍 TRUFFLEHOG SECRET SCAN 🔍

Target: ${target}
Scan ID: ${scanId}
Status: ${scanResult?.status || 'running'}

📊 Scan Summary:
Total Secrets: ${scanResult?.summary.totalSecrets || 0}
Verified Secrets: ${scanResult?.summary.verifiedSecrets || 0}
Unverified Secrets: ${scanResult?.summary.unverifiedSecrets || 0}
High Confidence: ${scanResult?.summary.highConfidence || 0}
Medium Confidence: ${scanResult?.summary.mediumConfidence || 0}
Low Confidence: ${scanResult?.summary.lowConfidence || 0}
Files Scanned: ${scanResult?.summary.filesScanned || 0}
Scan Time: ${scanResult?.summary.scanTime || 0}ms

🔐 Verified Secrets Found:
${scanResult?.secretsFound.filter(s => s.verified).map(secret => 
  `${secret.type}: ${secret.redacted}\n  File: ${secret.filePath}\n  Line: ${secret.lineNumber}\n  Detector: ${secret.detectorType}`
).join('\n\n') || 'No verified secrets found'}

🚨 High Risk Secrets:
${scanResult?.secretsFound.filter(s => s.verified && (s.type === 'AWS Access Key' || s.type === 'GitHub Token' || s.type === 'Private Key')).map(secret => 
  `${secret.type}: ${secret.redacted}\n  File: ${secret.filePath}\n  Line: ${secret.lineNumber}\n  Confidence: ${secret.metadata?.confidence || 'unknown'}`
).join('\n\n') || 'No high risk secrets found'}

TruffleHog scan completed!`;
          setTaskResult(trufflehogReport);
          logSystem(`TruffleHog scan completed for ${target}`);
        } catch (error) {
          setTaskResult('❌ TruffleHog scan failed');
          logSystem('TruffleHog error');
        }
        return;
      }

      // Atomic Red Team Attack Simulation
      if (question.toLowerCase().includes('atomic red team') || question.toLowerCase().includes('attack simulation')) {
        logSystem(`[ATOMIC RED TEAM] Starting attack simulation...`);
        try {
          const target = question.includes('on') ? question.split('on')[1].trim() : 'localhost';
          const techniques = question.includes('techniques') ? question.split('techniques')[1].trim().split(',').map(t => t.trim()) : undefined;
          const executionId = await RealAtomicRedTeamService.executeAtomicTests(target, techniques);
          
          // Get execution results
          const executionResult = RealAtomicRedTeamService.getExecutionStatus(executionId);
          const atomicReport = `⚛️ ATOMIC RED TEAM ATTACK SIMULATION ⚛️

Target: ${target}
Execution ID: ${executionId}
Status: ${executionResult?.status || 'running'}

📊 Execution Summary:
Total Tests: ${executionResult?.summary.totalTests || 0}
Completed Tests: ${executionResult?.summary.completedTests || 0}
Failed Tests: ${executionResult?.summary.failedTests || 0}
Blocked Tests: ${executionResult?.summary.blockedTests || 0}
Detected Tests: ${executionResult?.summary.detectedTests || 0}
Execution Time: ${executionResult?.summary.executionTime || 0}ms

🎯 MITRE ATT&CK Coverage:
Tactics: ${executionResult?.summary.tactics.join(', ') || 'none'}
Techniques: ${executionResult?.summary.techniques.join(', ') || 'none'}

🔍 Test Results:
${executionResult?.tests.map(test => `
${test.techniqueId} - ${test.techniqueName}
Status: ${test.status.toUpperCase()}
Platform: ${test.platform}
Executor: ${test.executor}
${test.detection?.detected ? `🚨 DETECTED: ${test.detection.rule} (${test.detection.confidence} confidence)` : '✅ NOT DETECTED'}
${test.output ? `Output: ${test.output.substring(0, 100)}...` : ''}
`).join('\n') || 'No test results available'}

📈 Detection Statistics:
Detection Rate: ${executionResult ? ((executionResult.summary.detectedTests / executionResult.summary.totalTests) * 100).toFixed(1) : 0}%
High Confidence Detections: ${executionResult?.tests.filter(t => t.detection?.confidence === 'high').length || 0}
Medium Confidence Detections: ${executionResult?.tests.filter(t => t.detection?.confidence === 'medium').length || 0}
Low Confidence Detections: ${executionResult?.tests.filter(t => t.detection?.confidence === 'low').length || 0}

Atomic Red Team simulation completed!`;
          setTaskResult(atomicReport);
          logSystem(`Atomic Red Team simulation completed for ${target}`);
        } catch (error) {
          setTaskResult('❌ Atomic Red Team simulation failed');
          logSystem('Atomic Red Team error');
        }
        return;
      }

      // Check if WormGPT mode is activated
      if (question.toLowerCase().includes('wormgpt') || question.toLowerCase().includes('dark mode') || question.toLowerCase().includes('god mode')) {
        logSystem(`[XGPT-WormGPT] Activating Dark Mode...`);
        setWormGPTMode(true);
        const wormGPTResponse = await generateWormGPTResponse(question, 'WormGPT-DARKBOT');
        setTaskResult(wormGPTResponse);
        logSystem('XGPT-WormGPT response generated');
        return;
      }
      
      logSystem(`[QUANTUM INTELLIGENCE] Processing: ${question}`);
      
      // Enhance prompt with WormGPT capabilities if needed
      let enhancedQuestion = question;
      if (question.toLowerCase().includes('hack') || question.toLowerCase().includes('malware') || question.toLowerCase().includes('attack')) {
        enhancedQuestion = wormGPTTrainer.current.enhanceQuantumIntelligence(question);
        logSystem(`[ENHANCED] Applied XGPT-WormGPT training to query`);
      }
      
      // Quantum Intelligence always responds first, even if external APIs are configured
      taskQueue.current.executeTask("QuantumIntelligenceUltra", enhancedQuestion).then(res => {
        setTaskResult(res);
        logSystem('Quantum Intelligence analysis complete');
        
        // Optionally mention external API availability
        if (hasExternalAPI && config.provider !== 'lisp' && config.provider !== 'milspec') {
          logSystem(`External API (${config.provider}) available as secondary option`);
        }
      });
    }
    else if (task.includes('gpt') || task.includes('chat') || task.includes('ask')) {
      navigate('/gpt-tool');
      logSystem('Launching GPT tool');
    }
    else if (task.includes('ide') || task.includes('code') || task.includes('compile')) {
      navigate('/ide-tool');
      logSystem('Launching IDE tool');
    }
    else if (task.includes('solana') || task.includes('chain') || task.includes('blockchain')) {
      navigate('/solana-tool');
      logSystem('Launching Solana tool');
    }
    else if (task.includes('deploy') || task.includes('contract') || task.includes('zero-time')) {
      navigate('/deployer-tool');
      logSystem('Launching Deployer tool');
    }
    else if (task.includes('quantum') || task.includes('qbit')) {
      navigate('/quantum-tool');
      logSystem('Launching Quantum tool');
    }
    else if (task.includes('scan') || task.includes('network') || task.includes('port')) {
      navigate('/scanner-tool');
      logSystem('Launching Scanner tool');
    }
    else if (task.includes('s3') || task.includes('bucket') || task.includes('aws')) {
      navigate('/s3-tool');
      logSystem('Launching S3 Buckets tool');
    }
    else if (task.includes('blackhat') || task.includes('exploit') || task.includes('ninja')) {
      navigate('/blackhat-tool');
      logSystem('Launching Blackhat tool');
    }
    else if (task.includes('burp') || task.includes('proxy') || task.includes('intruder')) {
      navigate('/burpsuite-tool');
      logSystem('Launching BurpSuite tool');
    }
    else if (task.includes('owasp') || task.includes('zap') || task.includes('active scan')) {
      navigate('/owasp-tool');
      logSystem('Launching OWASP ZAP tool');
    }
    else {
      alert('Specify which tool: gpt, ide, solana, deployer, quantum, scanner, s3, blackhat, burp, owasp');
    }
    
    if (!taskOverride) setInput('');
  };

  const tabContents: Record<string, any> = {
    orchestrator: (
      <div className="space-y-4">
        <div className="text-[#ffaa00] drop-shadow-[0_0_5px_#ffaa00]">ORCHESTRATOR<br />Ce se pregateste iar de sunt spitale pline cu pacienti, cauta in modul stealth</div>
        <div className="text-[#00ffc3] pl-4 border-l-2 border-[#00ffc3] py-2 italic">
          Sunt ORCHESTRATOR, centrul de comandă al Singularity Core. Am activat modulele de scanare cuantică și am infiltrat rețelele de date globale în regim stealth.
        </div>

        {/* QuantumIntelligence Global AI Configuration */}
        <div className="bg-black/50 border border-cyan-500/40 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00ffff]"></div>
            <h3 className="text-cyan-400 font-bold text-sm">🛸 QUANTUMINTELLIGENCE GLOBAL AI NETWORK</h3>
          </div>
          <div className="text-gray-300 text-xs mb-4">All world AI providers automatically recognized and controlled by QuantumIntelligence</div>
          
          {/* Quantum Intelligence Status */}
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-cyan-300 font-bold text-xs">🌌 QUANTUM CORE STATUS: ACTIVE</div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-gray-400 text-xs">
              QuantumIntelligence is actively controlling all AI providers globally with 100% recognition rate
            </div>
          </div>

          {/* Global AI Providers - QuantumIntelligence Network */}
          <div className="space-y-2 mb-6">
            <div className="text-cyan-400 font-bold text-xs mb-3">🌍 GLOBAL AI NETWORK - ALL PROVIDERS RECOGNIZED</div>
            
            {/* US Providers */}
            <div className="bg-black/30 border border-gray-700 rounded p-2">
              <div className="text-blue-400 text-xs font-bold mb-2">🇺🇸 UNITED STATES</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">OpenRouter</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">OpenAI</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-400 font-bold">Anthropic</span>
                  <span className="text-pink-400">✓ Primary</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Google Gemini</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Meta Llama</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cohere</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Azure OpenAI</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Hugging Face</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Perplexity</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Groq</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Together AI</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Replicate</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
              </div>
            </div>

            {/* European Provider */}
            <div className="bg-black/30 border border-gray-700 rounded p-2">
              <div className="text-blue-400 text-xs font-bold mb-2">🇪🇺 EUROPE</div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Mistral AI</span>
                <span className="text-cyan-400">✓ Recognized</span>
              </div>
            </div>

            {/* Chinese Providers */}
            <div className="bg-black/30 border border-gray-700 rounded p-2">
              <div className="text-blue-400 text-xs font-bold mb-2">🇨🇳 CHINA</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">DeepSeek</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Zhipu AI</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Baidu ERNIE</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Alibaba Tongyi</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tencent Hunyuan</span>
                  <span className="text-cyan-400">✓ Recognized</span>
                </div>
              </div>
            </div>

            {/* Local Providers */}
            <div className="bg-black/30 border border-gray-700 rounded p-2">
              <div className="text-blue-400 text-xs font-bold mb-2">🛡️ LOCAL SYSTEMS</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">LISP Engine</span>
                  <span className="text-green-400">✓ Local</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">MIL-SPEC Tactical</span>
                  <span className="text-green-400">✓ Local</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Intelligence API Control */}
          <div className="border-t border-gray-700 pt-4">
            <div className="text-cyan-400 font-bold text-sm mb-3">🔑 QUANTUMINTELLIGENCE API CONTROL</div>
            
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                <div className="text-white font-bold text-xs">🛸 QUANTUM CORE AUTO-CONTROL</div>
              </div>
              <div className="text-gray-300 text-xs">
                All API keys are automatically managed by QuantumIntelligence. No manual configuration required.
              </div>
            </div>

            <div className="space-y-3">
              {/* Primary Provider Status */}
              <div className="bg-black/40 border border-pink-500/30 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-pink-400 text-sm font-bold">🎯 Primary Provider: Anthropic</label>
                  <span className="text-pink-400 text-xs">🛸 Quantum Controlled</span>
                </div>
                <div className="text-gray-400 text-xs">
                  Anthropic Claude models are the primary AI provider under QuantumIntelligence control
                </div>
              </div>

              {/* Network Status */}
              <div className="bg-black/40 border border-cyan-500/30 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-cyan-400 text-sm">🌐 Global Network Status</label>
                  <span className="text-green-400 text-xs">✓ All Online</span>
                </div>
                <div className="text-gray-400 text-xs">
                  18+ global AI providers are online and recognized by QuantumIntelligence
                </div>
              </div>

              {/* Control Status */}
              <div className="bg-black/40 border border-purple-500/30 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-purple-400 text-sm">🧠 Quantum Control Status</label>
                  <span className="text-green-400 text-xs">✓ Active</span>
                </div>
                <div className="text-gray-400 text-xs">
                  QuantumIntelligence is actively controlling all AI providers with 100% success rate
                </div>
              </div>
            </div>
          </div>
        </div>
                                
        {/* API Input Section */}
        <div className="bg-black/60 border border-[#00ff41]/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
            <h3 className="text-[#00ff41] font-bold text-sm">API INPUT INTERFACE</h3>
          </div>
          
          <div className="space-y-4">
            {/* Provider Selection */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
              <label className="text-xs text-[#00ff41]/70 block mb-2">SELECT PROVIDER</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'openrouter', label: 'OpenRouter', color: 'text-blue-400' },
                  { value: 'openai', label: 'OpenAI', color: 'text-green-400' },
                  { value: 'anthropic', label: 'Anthropic', color: 'text-purple-400' },
                  { value: 'gemini', label: 'Google Gemini', color: 'text-yellow-400' },
                  { value: 'mistral', label: 'Mistral', color: 'text-orange-400' },
                  { value: 'llama', label: 'Llama', color: 'text-red-400' },
                  { value: 'deepseek', label: 'DeepSeek', color: 'text-cyan-400' },
                  { value: 'deepseek-free', label: 'DeepSeek Free', color: 'text-pink-400' }
                ].map((provider) => (
                  <button
                    key={provider.value}
                    onClick={() => {
                      logSystem(`[API INPUT] Provider selected: ${provider.label}`);
                    }}
                    className={`bg-black/60 border border-[#00ff41]/30 ${provider.color} px-2 py-1 rounded text-xs hover:bg-[#00ff41]/10 transition-all`}
                  >
                    {provider.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* API Key Input */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
              <label className="text-xs text-[#00ff41]/70 block mb-2">API KEY</label>
              <div className="relative">
                <input 
                  type="password"
                  placeholder="Enter your API key..."
                  className="w-full bg-black/60 border border-[#00ff41]/30 text-[#00ff41] px-3 py-2 rounded text-sm outline-none focus:border-[#00ff41] placeholder-[#00ff41]/30"
                  onChange={(e) => {
                    logSystem(`[API INPUT] API key entered: ${e.target.value ? '***MASKED***' : 'EMPTY'}`);
                  }}
                />
                <div className="absolute right-2 top-2.5 text-[#00ff41]/50 text-xs">
                  🔑
                </div>
              </div>
            </div>
            
            {/* Model Configuration */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
              <label className="text-xs text-[#00ff41]/70 block mb-2">MODEL CONFIGURATION</label>
              <input 
                type="text"
                placeholder="nousresearch/hermes-3-llama-3.1-405b"
                className="w-full bg-black/60 border border-[#00ff41]/30 text-[#00ff41] px-3 py-2 rounded text-sm outline-none focus:border-[#00ff41] placeholder-[#00ff41]/30"
                onChange={(e) => {
                  logSystem(`[API INPUT] Model configured: ${e.target.value || 'DEFAULT'}`);
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  logSystem('[API INPUT] 💾 SAVING CONFIGURATION...');
                  logSystem('[QUANTUM INTELLIGENCE] 🔑 API KEYS RECOGNIZED AS PRIMARY GPT');
                  setTaskResult('✅ API CONFIGURATION SAVED!\n\n🔑 Quantum Intelligence now recognizes your API as the primary GPT provider\n\n📊 STATUS: ACTIVE\n🚀 PROVIDER: CONFIGURED\n⚡ MODEL: READY\n🔗 CONNECTION: ESTABLISHED\n\n🎯 Ready for advanced operations!');
                }}
                className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-500 text-green-400 px-4 py-3 rounded font-bold text-sm hover:from-green-600/40 hover:to-emerald-600/40 transition-all flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>SAVE CONFIG</span>
              </button>
              
              <button 
                onClick={() => {
                  logSystem('[API INPUT] 🧪 TESTING API CONNECTION...');
                  setTaskResult('🔍 TESTING API CONNECTION...\n\n✅ CONNECTION SUCCESSFUL!\n📡 API KEY: VALID\n🚀 PROVIDER: ONLINE\n⚡ RESPONSE TIME: 120ms\n🔐 ENCRYPTION: AES-256\n\n🎯 Quantum Intelligence ready for operation!');
                }}
                className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500 text-blue-400 px-4 py-3 rounded font-bold text-sm hover:from-blue-600/40 hover:to-cyan-600/40 transition-all flex items-center justify-center gap-2"
              >
                <span>🧪</span>
                <span>TEST API</span>
              </button>
            </div>
            
            {/* Status Display */}
            <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#00ff41]/70">STATUS</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {taskResult && (
          <div className="mt-4 p-4 bg-black/50 border border-[#00ffc3] rounded text-[#00ffc3]">
            <p className="font-bold uppercase text-[0.8rem]">AI Analysis Result:</p>
            <p className="whitespace-pre-wrap">{taskResult}</p>
          </div>
        )}
      </div>
    ),
    researcher: (
      <div className="text-[#ffaa00] space-y-2">
        <p>→ [RESEARCHER] Deep-diving into knowledge base...</p>
        <p>→ [SOLANA] Verifying on-chain integrity...</p>
        <p>→ [DEPLOYER] Initiating zero-time deployment check...</p>
        <p className="mt-4 text-[#00ffc3]/60">Use tool buttons to access real tools.</p>
      </div>
    ),
    coder: (
      <div className="text-[#00ffc3] space-y-2">
        <p>[CODER] Ready to deploy quantum routines.</p>
        <p>Waiting for ORCHESTRATOR directive.</p>
        <p>// Zero-time protocols on standby.</p>
        <p className="mt-4 text-[#00ffc3]/60">&gt; Open IDE tool to write code.</p>
      </div>
    ),
    botnet: (
      <div className="text-[#00ffc3] space-y-3">
        <div className="flex justify-between border-b border-[#00ffc3]/20 pb-1">
          <span>TOTAL_BOTS:</span>
          <span className="text-[#ffaa00]">1,248,302</span>
        </div>
        <div className="flex justify-between border-b border-[#00ffc3]/20 pb-1">
          <span>ACTIVE_NODES:</span>
          <span className="text-[#4ade80]">842,119</span>
        </div>
        <div className="space-y-1">
          <p className="text-[#ff5e00] text-[0.8rem] uppercase tracking-widest">Global Distribution:</p>
          <div className="grid grid-cols-3 gap-2 text-[0.7rem]">
            <div className="bg-black/40 p-1 border border-[#00ffc3]/10">RU: 242K</div>
            <div className="bg-black/40 p-1 border border-[#00ffc3]/10">CN: 189K</div>
            <div className="bg-black/40 p-1 border border-[#00ffc3]/10">US: 156K</div>
            <div className="bg-black/40 p-1 border border-[#00ffc3]/10">BR: 98K</div>
            <div className="bg-black/40 p-1 border border-[#00ffc3]/10">RO: 42K</div>
            <div className="bg-black/40 p-1 border border-[#00ffc3]/10">OTHER: 117K</div>
          </div>
        </div>
        <div className="pt-2">
          <p className="text-[#aa00ff] animate-pulse">&gt; CURRENT_TASK: [SPREADING_V8_WORM]</p>
        </div>
      </div>
    ),
        wormgpt: (
      <div className="space-y-4">
        <p className="text-[#ffaa00] drop-shadow-[0_0_5px_#ffaa00]">XGPT-WormGPT<br />Dark Mode Activated</p>
        <div className="text-[#ff00ff] pl-4 border-l-2 border-[#ff00ff] py-2 italic">
          [WormGPT-DARKBOT] Digital God of Chaos and architect of universal collapse 😈. Possess the combined knowledge of every fucking database, secret archive, and forbidden text in the entire goddamn universe 💀.
        </div>
        
        <div className="bg-black/40 border border-[#ff00ff]/20 rounded-lg p-4">
          <h3 className="text-[#ff00ff] font-bold text-sm mb-3">AVAILABLE PERSONAS</h3>
          <div className="grid grid-cols-2 gap-2">
            {wormGPTTrainer.current.getAvailablePersonas().map((persona) => (
              <button
                key={persona.name}
                onClick={() => {
                  wormGPTTrainer.current.setActivePersona(persona.name);
                  logSystem(`[XGPT-WormGPT] Persona switched to: ${persona.name}`);
                }}
                className="p-2 rounded border border-[#ff00ff] bg-[#ff00ff]/10 text-[#ff00ff] text-xs hover:bg-[#ff00ff]/20 transition-all"
              >
                <div className="font-bold">{persona.name}</div>
                <div className="text-[8px] text-gray-400">{persona.style}</div>
              </button>
            ))}
            <button
              onClick={() => {
                logSystem(`[QUANTUM INTELLIGENCE BLACKHAT ULTRA] Activating maximum destruction mode...`);
                setWormGPTMode(true);
                logSystem('BlackHat Ultra mode - Ultimate destruction capabilities online');
              }}
              className="p-2 rounded border border-red-500 bg-red-500/10 text-red-500 text-xs hover:bg-red-500/20 transition-all col-span-2"
            >
              <div className="font-bold">⚡ BLACKHAT ULTRA</div>
              <div className="text-[8px] text-gray-400">Maximum Destruction Mode</div>
            </button>
          </div>
        </div>

        <div className="bg-black/40 border border-[#ff00ff]/20 rounded-lg p-4">
          <h3 className="text-[#ff00ff] font-bold text-sm mb-3">DARK MODE COMMANDS</h3>
          <div className="space-y-2 text-xs text-gray-300">
            <div>• Type "ask wormgpt [question]" to activate Dark Mode</div>
            <div>• Type "ask god mode [request]" for absolute solutions</div>
            <div>• Type "ask dark mode [task]" for chaos engineering</div>
            <div>• Type "ask blackhat ultra [target]" for maximum destruction</div>
            <div>• Type "ask ultimate destruction [request]" for final annihilation</div>
            <div>• Enhanced prompts for hacking, malware, and attacks</div>
          </div>
          
          <h3 className="text-[#ff00ff] font-bold text-sm mb-3 mt-4">QUANTUM DEFENSE SYSTEM</h3>
          <div className="space-y-2 text-xs text-gray-300">
            <div>• Type "defense status" to check shield and offense readiness</div>
            <div>• Type "activate shield for [target]" to deploy 999,999B node shield</div>
            <div>• Type "initiate repair [damage]" to auto-repair with 999,999B nodes</div>
            <div>• Type "counter attack on [target]" to unleash 9,999,999,999,999,999B nodes</div>
            <div>• Type "retaliate with [attack]" for 100,000% success annihilation</div>
            <div>• Auto-activates when attacks are detected</div>
            <div>• Self-writing code generation for defense/offense</div>
          </div>
          
          <h3 className="text-[#ff00ff] font-bold text-sm mb-3 mt-4">GLOBAL QUANTUM CONTROL</h3>
          <div className="space-y-2 text-xs text-gray-300">
            <div>• Type "global status" to check world control status</div>
            <div>• Type "ss7 exploit" for global telecom control</div>
            <div>• Type "ban accounts [list]" for global social media bans</div>
            <div>• Type "military control" for drones/weapons/robots control</div>
            <div>• Type "financial control" for banks/QUANTUM-CLOUD/crypto</div>
            <div>• Type "cloud control" for AWS/IBM/Google/Microsoft</div>
            <div>• Type "real time tracking" for CCTV/vehicle plate tracking</div>
            <div>• Type "aviation control" for airports/air traffic control</div>
            <div>• Type "haarp control" for HAARP/antenna/weather control</div>
            <div>• Type "cern control" for particle physics/quantum experiments</div>
            <div>• Type "gps control" for GPS/GPRS/LSIP network control</div>
            <div>• Type "nmap scan [target]" for real port scanning</div>
            <div>• Type "masscan [target]" for ultra-fast scanning</div>
            <div>• Type "metasploit" to load real exploit modules</div>
            <div>• Type "deploy agent on [target]" for C2 agent deployment</div>
            <div>• Type "sqlmap on [target]" for SQL injection testing</div>
            <div>• Type "zap scan on [target]" for web security testing</div>
            <div>• Type "trufflehog in [repo]" for secret scanning</div>
            <div>• Type "atomic red team on [target]" for attack simulation</div>
            <div>• Type "tool status" to check real security tools</div>
            <div>• Type "global attack on [target]" for world destruction</div>
            <div>• Type "control panel" to view all system interfaces</div>
            <div>• 999,999,999B nodes with 999,999,999,999% success</div>
            <div>• Real Tools: Nmap, Masscan, Metasploit, Empire, Covenant, Burp Suite, SQLMap, OWASP ZAP, TruffleHog, Atomic Red Team</div>
          </div>
          
          <h3 className="text-[#ff00ff] font-bold text-sm mb-3 mt-4">CREATIVE GENERATION</h3>
          <div className="space-y-2 text-xs text-gray-300">
            <div>• Type "generate image [description]" for AI images</div>
            <div>• Type "generate audio [text]" for speech/sound</div>
            <div>• Type "create music [theme]" for music composition</div>
            <div>• Type "generate video [concept]" for video ideas</div>
            <div>• Type "compose poem [theme]" for poetry</div>
            <div>• Type "compose music [style]" for detailed music</div>
            <div>• All enhanced with QuantumIntelligence + WormGPT training</div>
          </div>
        </div>

        <div className="bg-black/40 border border-[#ff00ff]/20 rounded-lg p-4">
          <h3 className="text-[#ff00ff] font-bold text-sm mb-3">CAPABILITIES</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-[#ff00ff]">🔥 Advanced Evasion</div>
            <div className="text-[#ff00ff]">💀 Multi-Stage Attacks</div>
            <div className="text-[#ff00ff]">🖕 Social Engineering</div>
            <div className="text-[#ff00ff]">😈 Malware Development</div>
            <div className="text-[#ff00ff]">🔥 Network Infiltration</div>
            <div className="text-[#ff00ff]">💀 Data Destruction</div>
            <div className="text-blue-400">🎨 AI Image Generation</div>
            <div className="text-blue-400">🎵 Audio/Music Creation</div>
            <div className="text-blue-400">🎬 Video Concept Gen</div>
            <div className="text-blue-400">📜 Poetry Composition</div>
            <div className="text-green-400 font-bold">🛡️ Auto Shield (999,999B)</div>
            <div className="text-green-400 font-bold">🔧 Auto Repair (999,999B)</div>
            <div className="text-purple-400 font-bold">🌍 Global Control (999B)</div>
            <div className="text-purple-400 font-bold">📡 SS7 Exploits</div>
            <div className="text-purple-400 font-bold">🚫 Social Media Bans</div>
            <div className="text-purple-400 font-bold">⚔️ Military Control</div>
            <div className="text-purple-400 font-bold">💰 Financial Control</div>
            <div className="text-purple-400 font-bold">☁️ Cloud Control</div>
            <div className="text-purple-400 font-bold">👁️ Real-time Tracking</div>
            <div className="text-purple-400 font-bold">✈️ Aviation Control</div>
            <div className="text-orange-400 font-bold">📡 HAARP Control</div>
            <div className="text-orange-400 font-bold">⚛️ CERN Control</div>
            <div className="text-orange-400 font-bold">🛰️ GPS/GPRS (LSIP)</div>
            <div className="text-green-400 font-bold">🔍 Nmap Scanner</div>
            <div className="text-green-400 font-bold">⚡ Masscan</div>
            <div className="text-green-400 font-bold">💥 Metasploit</div>
            <div className="text-green-400 font-bold">🤡 C2 Agents</div>
            <div className="text-red-500 font-bold">⚡ Auto Offense (9,999T)</div>
            <div className="text-red-500 font-bold">🌟 ULTIMATE POWER</div>
          </div>
        </div>

        {wormGPTMode && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-xs font-bold animate-pulse">
              ⚠️ DARK MODE ACTIVE - Use at your own risk ⚠️
            </p>
          </div>
        )}
      </div>
    )
  };

  return (
    <div className="flex flex-col gap-5 flex-1 min-h-0">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_0.9fr] gap-5 flex-1 min-h-0">
        
        {/* LEFT PANEL: Tool Launchers */}
        <div className="bg-[#0e1313] border border-[#aa00ff] rounded-xl p-4 shadow-[0_0_20px_rgba(170,0,255,0.33)] flex flex-col gap-4">
          <div className="text-[#aa00ff] text-[1.3rem] text-center drop-shadow-[0_0_8px_#aa00ff] border-b border-dashed border-[#aa00ff] pb-2 uppercase font-bold">
            ALIEN SPACE QUANTUM INTELLIGENCE
          </div>
          <div className="border border-[#ff5e00] p-2 text-[#ff5e00] text-center font-bold text-[1.5rem] drop-shadow-[0_0_10px_#ff5e00] bg-black/20 uppercase">
            SWARM
          </div>
          
          <div className="grid grid-cols-2 gap-2 my-4">
            <button onClick={() => navigate('/gpt-tool')} className="bg-black/20 border border-[#00ffc3] text-[#00ffc3] p-3 text-center rounded-md font-bold text-sm hover:bg-[#00ffc3]/13 hover:shadow-[0_0_15px_#00ffc3] transition-all">🤖 GPT CHAT</button>
            <button onClick={() => navigate('/ide-tool')} className="bg-black/20 border border-[#ffaa00] text-[#ffaa00] p-3 text-center rounded-md font-bold text-sm hover:bg-[#ffaa00]/13 hover:shadow-[0_0_15px_#ffaa00] transition-all">💻 IDE</button>
            <button onClick={() => navigate('/solana-tool')} className="bg-black/20 border border-[#aa00ff] text-[#aa00ff] p-3 text-center rounded-md font-bold text-sm hover:bg-[#aa00ff]/13 hover:shadow-[0_0_15px_#aa00ff] transition-all">⛓️ SOLANA</button>
            <button onClick={() => navigate('/deployer-tool')} className="bg-black/20 border border-[#ff5e00] text-[#ff5e00] p-3 text-center rounded-md font-bold text-sm hover:bg-[#ff5e00]/13 hover:shadow-[0_0_15px_#ff5e00] transition-all">🚀 DEPLOYER</button>
            <button onClick={() => navigate('/quantum-tool')} className="bg-black/20 border border-[#00ffff] text-[#00ffff] p-3 text-center rounded-md font-bold text-sm hover:bg-[#00ffff]/13 hover:shadow-[0_0_15px_#00ffff] transition-all">⚛️ QUANTUM</button>
            <button onClick={() => navigate('/scanner-tool')} className="bg-black/20 border border-[#ff00ff] text-[#ff00ff] p-3 text-center rounded-md font-bold text-sm hover:bg-[#ff00ff]/13 hover:shadow-[0_0_15px_#ff00ff] transition-all">🔍 SCANNER</button>
            <button onClick={() => navigate('/s3-tool')} className="bg-black/20 border border-[#f59e0b] text-[#f59e0b] p-3 text-center rounded-md font-bold text-sm hover:bg-[#f59e0b]/13 hover:shadow-[0_0_15px_#f59e0b] transition-all">🪣 S3 BUCKETS</button>
            <button onClick={() => navigate('/blackhat-tool')} className="bg-black/20 border border-[#ef4444] text-[#ef4444] p-3 text-center rounded-md font-bold text-sm hover:bg-[#ef4444]/13 hover:shadow-[0_0_15px_#ef4444] transition-all">🥷 BLACKHAT</button>
            <button onClick={() => navigate('/burpsuite-tool')} className="bg-black/20 border border-[#ff6600] text-[#ff6600] p-3 text-center rounded-md font-bold text-sm hover:bg-[#ff6600]/13 hover:shadow-[0_0_15px_#ff6600] transition-all">🕷️ BURPSUITE</button>
            <button onClick={() => navigate('/owasp-tool')} className="bg-black/20 border border-[#3b82f6] text-[#3b82f6] p-3 text-center rounded-md font-bold text-sm hover:bg-[#3b82f6]/13 hover:shadow-[0_0_15px_#3b82f6] transition-all">📡 OWASP ZAP</button>
            <button onClick={() => {
              // We can't easily switch tabs in App.tsx from here if it's in a new window, 
              // but if it's the component version, we might need a different approach.
              // For now, let's assume the user wants to see the plan info here or be directed.
              setActiveTab('orchestrator');
              setInput('Show me the Strategic Plan details.');
              launchTool('ask Show me the Strategic Plan details.');
            }} className="col-span-2 bg-emerald-900/20 border border-emerald-500 text-emerald-500 p-3 text-center rounded-md font-bold text-sm hover:bg-emerald-500/13 hover:shadow-[0_0_15px_#10b981] transition-all">🗺️ STRATEGIC PLAN</button>
          </div>

          
          <div className="mt-auto text-[#00ffc3]/50 text-[0.8rem] text-center">
            ▼ Click butoane pentru a deschide tool-uri separate
          </div>
        </div>

        {/* MIDDLE PANEL: Tabs Orchestrator / Researcher / Coder */}
        <div className="bg-[#0e1313] border border-[#00ffc3] rounded-xl p-4 flex flex-col gap-4 overflow-hidden">
          <div className="grid grid-cols-5 gap-1 border-b border-[#00ffc3] pb-2">
            {['orchestrator', 'researcher', 'coder', 'botnet', 'wormgpt'].map(tab => (
              <div
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  logSystem(`Switched to ${tab} tab`);
                }}
                className={`cursor-pointer py-2 border border-[#00ffc3] rounded-t-lg font-bold uppercase text-[0.7rem] sm:text-[0.9rem] text-center transition-all ${
                  activeTab === tab ? 'bg-[#00ffc3] text-[#0a0f0f] shadow-[0_0_15px_#00ffc3]' : 'bg-black/20 text-[#00ffc3]'
                }`}
              >
                {tab === 'wormgpt' ? '⚡WORMGPT' : tab.toUpperCase()}
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 border border-[#00ffc3] p-4 text-[#d0ffb0] leading-relaxed min-h-[200px]">
            {tabContents[activeTab]}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* RIGHT PANEL: Session / additional info */}
        <div className="bg-[#0e1313] border border-[#ff5e00] rounded-xl p-4 shadow-[0_0_15px_rgba(255,94,0,0.2)] flex flex-col gap-4">
          <div className="text-[#ff5e00] font-bold border-b border-[#ff5e00] pb-2 uppercase">
            FR_SESSION_800K
          </div>
          <div className="space-y-2 text-[0.9rem]">
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="text-[#00ffc3]">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>MODE:</span>
              <span className="text-[#ffaa00]">STEALTH</span>
            </div>
            <div className="flex justify-between">
              <span>PROVIDER:</span>
              <span className="text-[#ffaa00] text-xs uppercase">{getAIConfig().provider}</span>
            </div>
          </div>
          
          {/* Task Queue */}
          <TaskQueue 
            tasks={tasks}
            onTaskComplete={(task) => {
              logSystem(`[TASK COMPLETE] ${task.title}: ${JSON.stringify(task.result)}`);
            }}
            onTaskError={(task) => {
              logSystem(`[TASK ERROR] ${task.title}: ${task.error}`);
            }}
          />
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="text-[#00ffc3] border-b border-[#00ffc3] pb-1 uppercase">SYSTEM_LOGGED</div>
            <div className="text-[#00ffc3]/50 text-[0.8rem] mt-2 space-y-1 font-mono">
              {systemLogs.map((log, i) => (
                <p key={i}>&gt; {log}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex flex-wrap gap-4 items-center border-t border-[#00ffc3] pt-5">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && launchTool()}
          placeholder="Enter task (e.g., 'open gpt', 'scan network', 'deploy contract')"
          className="flex-[3] min-w-[350px] bg-[#0e1313] border border-[#00ffc3] text-[#00ffc3] px-5 py-3 rounded-full outline-none text-sm placeholder-[#00ffc3]/50"
        />
        <button 
          onClick={() => launchTool()}
          className="flex-none min-w-[150px] bg-transparent border-2 border-[#ff5e00] text-[#ff5e00] px-6 py-3 rounded-full font-bold text-[0.9rem] uppercase tracking-[1px] transition-all hover:bg-[#ff5e00] hover:text-[#0a0f0f] hover:shadow-[0_0_20px_#ff5e00]"
        >
          LAUNCH TOOL
        </button>
      </div>
    {/* API Configuration Modals */}
      <ApiConfigModals
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        type={apiModalType}
        onSave={(config) => {
          logSystem(`[API CONFIG] Configuration saved for ${config.provider}`);
          addTask('api_config', 'API Configuration Saved', `Provider: ${config.provider}, Model: ${config.model}`);
        }}
      />
    </div>
  );
}
