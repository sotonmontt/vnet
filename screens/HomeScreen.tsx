
import React, { useState } from 'react';
import type { ConnectionStatus, ServerConfig, Traffic } from '../types';
import ConnectButton from '../components/ConnectButton';
import ServerList from '../components/ServerList';
import StatusBar from '../components/StatusBar';
import { PlusIcon } from '../constants';
import AddServerModal from '../components/AddServerModal';

interface HomeScreenProps {
  status: ConnectionStatus;
  onConnect: () => void;
  servers: ServerConfig[];
  selectedServer: ServerConfig | null;
  onSelectServer: (id: string) => void;
  onDeleteServer: (id: string) => void;
  traffic: Traffic;
  connectedTime: number;
  onAddServer: (config: ServerConfig) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  status,
  onConnect,
  servers,
  selectedServer,
  onSelectServer,
  onDeleteServer,
  traffic,
  connectedTime,
  onAddServer,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-center text-white mb-2">V-Net Client</h1>
      <p className="text-center text-gray-400 mb-4">Secure & Private Connection</p>
      
      <ConnectButton status={status} onConnect={onConnect} />
      
      <StatusBar traffic={traffic} connectedTime={connectedTime} status={status} />

      <div className="mt-6 flex-grow">
        <ServerList 
          servers={servers} 
          selectedServerId={selectedServer?.id || null} 
          onSelectServer={onSelectServer} 
          onDeleteServer={onDeleteServer}
        />
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 right-6 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 z-40"
        aria-label="Add Server"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <AddServerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddServer={onAddServer}
      />
    </div>
  );
};

export default HomeScreen;