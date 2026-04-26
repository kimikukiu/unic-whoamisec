import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Loader, Play, Pause, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Task {
  id: string;
  type: 'api_config' | 'api_test' | 'global_control' | 'security_op' | 'scan' | 'exploit';
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

interface TaskQueueProps {
  tasks?: Task[];
  onTaskComplete?: (task: Task) => void;
  onTaskError?: (task: Task) => void;
}

const TaskQueue: React.FC<TaskQueueProps> = ({ tasks: initialTasks = [], onTaskComplete, onTaskError }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-process tasks
  useEffect(() => {
    if (!isProcessing && tasks.some(task => task.status === 'pending')) {
      processNextTask();
    }
  }, [tasks, isProcessing]);

  const processNextTask = async () => {
    const nextTask = tasks.find(task => task.status === 'pending');
    if (!nextTask) return;

    setIsProcessing(true);
    
    // Update task status to running
    setTasks(prev => prev.map(task => 
      task.id === nextTask.id 
        ? { ...task, status: 'running', startedAt: new Date(), progress: 0 }
        : task
    ));

    // Simulate task processing
    try {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setTasks(prev => prev.map(task => 
          task.id === nextTask.id 
            ? { ...task, progress }
            : task
        ));
      }

      // Task completed successfully
      const completedTask = {
        ...nextTask,
        status: 'completed' as const,
        progress: 100,
        completedAt: new Date(),
        result: generateTaskResult(nextTask.type)
      };

      setTasks(prev => prev.map(task => 
        task.id === nextTask.id ? completedTask : task
      ));

      if (onTaskComplete) {
        onTaskComplete(completedTask);
      }

    } catch (error) {
      // Task failed
      const failedTask = {
        ...nextTask,
        status: 'failed' as const,
        completedAt: new Date(),
        error: 'Task execution failed'
      };

      setTasks(prev => prev.map(task => 
        task.id === nextTask.id ? failedTask : task
      ));

      if (onTaskError) {
        onTaskError(failedTask);
      }
    }

    setIsProcessing(false);
  };

  const generateTaskResult = (type: Task['type']) => {
    switch (type) {
      case 'api_config':
        return { provider: 'OpenRouter', status: 'configured', apiKey: '***MASKED***' };
      case 'api_test':
        return { connection: 'success', latency: '45ms', provider: 'OpenRouter' };
      case 'global_control':
        return { systems: 8, nodes: '999,999,999B', success: '100%' };
      case 'security_op':
        return { shield: 'active', nodes: '999,999B', status: 'impervious' };
      case 'scan':
        return { ports: 22, services: 15, vulnerabilities: 3 };
      case 'exploit':
        return { success: true, payload: 'delivered', access: 'root' };
      default:
        return { status: 'completed' };
    }
  };

  const addTask = (type: Task['type'], title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      type,
      title,
      description,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    setTasks(prev => [...prev, newTask]);
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => task.status !== 'completed'));
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'running':
        return <Loader className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 border-yellow-400/20';
      case 'running':
        return 'text-blue-400 border-blue-400/20';
      case 'completed':
        return 'text-green-400 border-green-400/20';
      case 'failed':
        return 'text-red-400 border-red-400/20';
    }
  };

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'api_config':
      case 'api_test':
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'global_control':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'security_op':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'scan':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'exploit':
        return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const runningCount = tasks.filter(task => task.status === 'running').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;

  return (
    <div className="bg-black/90 border border-[#00ff41]/30 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[#00ff41] font-bold text-sm">TASK QUEUE</h3>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                {pendingCount} pending
              </span>
            )}
            {runningCount > 0 && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                {runningCount} running
              </span>
            )}
            {completedCount > 0 && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                {completedCount} completed
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tasks in queue
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`bg-black/40 border rounded-lg p-3 ${getStatusColor(task.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(task.status)}
                      <span className="text-white font-medium text-sm">{task.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(task.type)}`}>
                        {task.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{task.description}</p>
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors ml-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Progress Bar */}
                {task.status === 'running' && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Processing...</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Task Result/Error */}
                {task.status === 'completed' && task.result && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                    <div className="text-xs text-green-400">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(task.result, null, 2)}</pre>
                    </div>
                  </div>
                )}

                {task.status === 'failed' && task.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
                    <div className="text-xs text-red-400">{task.error}</div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Created: {task.createdAt.toLocaleTimeString()}</span>
                  {task.completedAt && (
                    <span>Completed: {task.completedAt.toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing task queue...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Export hook for adding tasks
export const useTaskQueue = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (type: Task['type'], title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      type,
      title,
      description,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  };

  return { tasks, addTask, setTasks };
};

export default TaskQueue;
