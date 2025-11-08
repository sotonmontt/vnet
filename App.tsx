
import React, { useState, useEffect, useCallback } from 'react';
import type { ServerConfig, ConnectionStatus, Settings, Screen, Traffic } from './types';
import { Protocol, DOH_PRESETS, INITIAL_SERVERS } from './constants';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [servers, setServers] = useState<ServerConfig[]>(() => {
    const saved = localStorage.getItem('vpn_servers');
    return saved ? JSON.parse(saved) : INITIAL_SERVERS;
  });
  const [selectedServerId, setSelectedServerId] = useState<string | null>(() => {
    const saved = localStorage.getItem('vpn_selected_server');
    return saved ?? (INITIAL_SERVERS.length > 0 ? INITIAL_SERVERS[0].id : null);
  });
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('vpn_settings');
    return saved ? JSON.parse(saved) : {
      doh: DOH_PRESETS[0].url,
      enableIPV6: false,
      logLevel: 'warn',
    };
  });
  const [traffic, setTraffic] = useState<Traffic>({ up: 0, down: 0 });
  const [connectedTime, setConnectedTime] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('vpn_servers', JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
    if (selectedServerId) {
      localStorage.setItem('vpn_selected_server', selectedServerId);
    }
  }, [selectedServerId]);

  useEffect(() => {
    localStorage.setItem('vpn_settings', JSON.stringify(settings));
  }, [settings]);
  
  useEffect(() => {
    let trafficInterval: number;
    let timeInterval: number;

    if (status === 'CONNECTED') {
      setConnectedTime(0);
      setTraffic({ up: 0, down: 0 });
      
      timeInterval = window.setInterval(() => {
        setConnectedTime(prev => prev + 1);
      }, 1000);

      trafficInterval = window.setInterval(() => {
        setTraffic(prev => ({
          up: prev.up + Math.random() * 150, // simulated kbps
          down: prev.down + Math.random() * 1200, // simulated kbps
        }));
      }, 1500);
    }

    return () => {
      clearInterval(trafficInterval);
      clearInterval(timeInterval);
    };
  }, [status]);


  const handleConnect = useCallback(() => {
    if (status === 'DISCONNECTED' && selectedServerId) {
      setStatus('CONNECTING');
      setTimeout(() => {
        setStatus('CONNECTED');
      }, 2000);
    } else if (status === 'CONNECTED') {
      setStatus('DISCONNECTING');
      setTimeout(() => {
        setStatus('DISCONNECTED');
        setTraffic({ up: 0, down: 0 });
        setConnectedTime(0);
      }, 1500);
    }
  }, [status, selectedServerId]);

  const addServer = (config: ServerConfig) => {
    setServers(prev => [...prev, config]);
  };

  const deleteServer = (id: string) => {
    setServers(prev => prev.filter(s => s.id !== id));
    if (selectedServerId === id) {
      setSelectedServerId(servers.length > 1 ? servers.filter(s => s.id !== id)[0].id : null);
    }
  };

  const selectedServer = servers.find(s => s.id === selectedServerId) || null;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <main className="flex-grow container mx-auto p-4 max-w-lg">
        {screen === 'home' && (
          <HomeScreen
            status={status}
            onConnect={handleConnect}
            servers={servers}
            selectedServer={selectedServer}
            onSelectServer={setSelectedServerId}
            onDeleteServer={deleteServer}
            traffic={traffic}
            connectedTime={connectedTime}
            onAddServer={addServer}
          />
        )}
        {screen === 'settings' && (
          <SettingsScreen settings={settings} onSettingsChange={setSettings} />
        )}
      </main>
      <BottomNav activeScreen={screen} onNavigate={setScreen} />
    </div>
  );
};

export default App;