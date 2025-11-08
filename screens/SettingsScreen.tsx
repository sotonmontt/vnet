import React, { useState } from 'react';
import type { Settings, ServerConfig } from '../types';
// FIX: Import Protocol enum to correctly type the dummy server config.
import { DOH_PRESETS, Protocol } from '../constants';
import { getTroubleshootingAdvice } from '../services/geminiService';

interface SettingsScreenProps {
  settings: Settings;
  onSettingsChange: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onSettingsChange }) => {
  const [isTroubleshooting, setIsTroubleshooting] = useState(false);
  const [troubleshootingResult, setTroubleshootingResult] = useState('');

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'dohSelect') {
        onSettingsChange(prev => ({
            ...prev,
            doh: value === 'custom' ? '' : value
        }));
        return;
    }

    if (name === 'customDoh') {
        onSettingsChange(prev => ({
            ...prev,
            doh: value
        }));
        return;
    }

    const isCheckbox = type === 'checkbox';
    onSettingsChange(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleTroubleshoot = async () => {
      setIsTroubleshooting(true);
      setTroubleshootingResult('');
      // In a real app, we'd pass the currently selected server config
      // For this mockup, we'll pass a dummy server to get relevant advice.
      const dummyServer: ServerConfig = {
          id: 'troubleshoot-1',
          name: 'Sample Server',
          // FIX: Use Protocol enum member instead of a raw string.
          protocol: Protocol.VLESS,
          address: 'test.server.com',
          port: 443,
          details: {}
      };
      const advice = await getTroubleshootingAdvice(dummyServer);
      setTroubleshootingResult(advice);
      setIsTroubleshooting(false);
  };

  const isCustomDoh = !DOH_PRESETS.some(p => p.url === settings.doh);
  const dohSelectValue = isCustomDoh ? 'custom' : settings.doh;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2">DNS Settings</h2>
        
        <label htmlFor="doh" className="block text-sm font-medium text-gray-300">
          DNS over HTTPS (DoH)
        </label>
        <select
          id="doh"
          name="dohSelect"
          value={dohSelectValue}
          onChange={handleSettingsChange}
          className="w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
        >
          {DOH_PRESETS.map(preset => (
            <option key={preset.name} value={preset.url}>{preset.name}</option>
          ))}
          <option value="custom">Custom</option>
        </select>
        
        {isCustomDoh && (
             <div className="mt-2">
                <label htmlFor="customDoh" className="block text-sm font-medium text-gray-300 sr-only">
                    Custom DoH URL / DNS
                </label>
                <input
                    type="text"
                    id="customDoh"
                    name="customDoh"
                    value={settings.doh}
                    onChange={handleSettingsChange}
                    placeholder="e.g., https://dns.example.com/query or 8.8.8.8"
                    className="mt-1 w-full bg-gray-900 text-white border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>
        )}
      </div>

      <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2">Connection</h2>
        
        <div className="flex items-center justify-between">
            <span className="text-gray-300">Enable IPv6</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="enableIPV6" checked={settings.enableIPV6} onChange={handleSettingsChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
        </div>
      </div>

      <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2">AI Troubleshooter</h2>
        <p className="text-sm text-gray-400">Having connection problems? Get instant advice from our AI assistant.</p>
        <button
            onClick={handleTroubleshoot}
            disabled={isTroubleshooting}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
            {isTroubleshooting ? 'Analyzing...' : 'Get Connection Advice'}
        </button>
        {troubleshootingResult && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{troubleshootingResult}</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default SettingsScreen;
