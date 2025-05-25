import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Lock,
  MessageSquare,
  Database,
  FileText,
  Shield
} from 'lucide-react';

// Type definitions
interface Config {
  systemPrompt: string;
  conversationHistoryLimit: number;
  topK_RAG_hits: number;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const ConfigPanel: React.FC = () => {
  // State management with proper types
  const [config, setConfig] = useState<Config>({
    systemPrompt: '',
    conversationHistoryLimit: 3,
    topK_RAG_hits: 4
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [originalConfig, setOriginalConfig] = useState<Config | null>(null);

  // ===== CONFIGURATION SECTION =====
  
  const BASE_URL = 'http://chat.xavigate.com:8080/api';
  
  const DEFAULT_SYSTEM_PROMPT = `Hi, I'm Xavigate, your AI assistant specializing in Multiple Natures theory and Alignment Dynamics. I help users understand their traits, improve alignment, and navigate personal development using the MN/AD framework.`;

  // TO BE DONE: Replace this with your actual admin check
  const isAdmin = true; // Set to false to see the "Access Denied" screen
  
  // TO BE DONE: Add your authentication token logic here if needed
  const getAuthToken = (): string | null => {
    return null;
  };
  
  // ===== END CONFIGURATION SECTION =====

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/config`, {
        headers: {
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (response.ok) {
        const data: Config = await response.json();
        setConfig(data);
        setOriginalConfig(data);
        showNotification('Configuration loaded successfully', 'success');
      } else {
        throw new Error('Failed to fetch configuration');
      }
    } catch (error) {
      showNotification('Error loading configuration', 'error');
      setConfig({
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        conversationHistoryLimit: 3,
        topK_RAG_hits: 4
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (): Promise<void> => {
    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        setOriginalConfig(config);
        setHasChanges(false);
        showNotification('Configuration saved successfully', 'success');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      showNotification('Error saving configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = (): void => {
    setConfig({
      ...config,
      systemPrompt: DEFAULT_SYSTEM_PROMPT
    });
    setHasChanges(true);
  };

  const resetAll = (): void => {
    if (originalConfig) {
      setConfig(originalConfig);
      setHasChanges(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setConfig({ ...config, systemPrompt: e.target.value });
    setHasChanges(true);
  };

  const handleHistoryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setConfig({ ...config, conversationHistoryLimit: value });
      setHasChanges(true);
    }
  };

  const handleTopKChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setConfig({ ...config, topK_RAG_hits: value });
      setHasChanges(true);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error'): void => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Access Denied Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-md w-full text-center">
          <Lock className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Administrator privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Xavigate Configuration</h1>
              <p className="text-gray-600 mt-2">Runtime AI Configuration Panel</p>
            </div>
            {hasChanges && (
              <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-medium">
                Unsaved Changes
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATION */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3" /> : <AlertCircle className="h-5 w-5 mr-3" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* SYSTEM PROMPT SECTION */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">System Prompt</h2>
              <button
                onClick={resetToDefault}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset to Default
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Define the AI assistant's behavior and personality
            </p>
          </div>
          
          <textarea
            value={config.systemPrompt}
            onChange={handlePromptChange}
            className="w-full h-96 p-6 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono bg-gray-50"
            placeholder="Enter system prompt..."
          />
        </div>

        {/* PARAMETERS SECTION */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Runtime Parameters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Conversation History */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Conversation History</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Number of previous messages to include for context
              </p>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.conversationHistoryLimit}
                  onChange={handleHistoryChange}
                  className="w-24 px-4 py-2 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <div className="ml-6 text-sm text-gray-600">
                  <div>Min: 1, Max: 10</div>
                  <div>Default: 3</div>
                </div>
              </div>
            </div>

            {/* RAG Top-K */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">RAG Top-K Results</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Number of knowledge base documents to retrieve
              </p>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.topK_RAG_hits}
                  onChange={handleTopKChange}
                  className="w-24 px-4 py-2 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <div className="ml-6 text-sm text-gray-600">
                  <div>Min: 1, Max: 10</div>
                  <div>Default: 4</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between">
            <button
              onClick={resetAll}
              disabled={!hasChanges || saving}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <RefreshCw className="inline h-5 w-5 mr-2" />
              Discard Changes
            </button>
            <button
              onClick={saveConfig}
              disabled={!hasChanges || saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="inline h-5 w-5 mr-2" />
                  Save All Settings
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfigPanel;