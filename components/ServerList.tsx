
import React from 'react';
import type { ServerConfig } from '../types';
import { Protocol } from '../constants';
import { TrashIcon } from '../constants';

interface ServerListItemProps {
  config: ServerConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProtocolBadge: React.FC<{ protocol: Protocol }> = ({ protocol }) => {
  const colors: Record<Protocol, string> = {
    [Protocol.VLESS]: 'bg-blue-500/20 text-blue-300',
    [Protocol.VMESS]: 'bg-purple-500/20 text-purple-300',
    [Protocol.TROJAN]: 'bg-red-500/20 text-red-300',
    [Protocol.SHADOWSOCKS]: 'bg-yellow-500/20 text-yellow-300',
  };
  return <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors[protocol]}`}>{protocol}</span>;
};

const ServerListItem: React.FC<ServerListItemProps> = ({ config, isSelected, onSelect, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(config.id);
  };
  
  return (
    <li
      onClick={() => onSelect(config.id)}
      className={`flex items-center justify-between p-3 my-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-cyan-500/20 ring-2 ring-cyan-400' : 'bg-gray-800 hover:bg-gray-700'}`}
    >
      <div className="flex flex-col">
        <span className="font-semibold text-white">{config.name}</span>
        <span className="text-sm text-gray-400">{config.address}:{config.port}</span>
      </div>
      <div className="flex items-center space-x-3">
        <ProtocolBadge protocol={config.protocol} />
        <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors">
            <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};


interface ServerListProps {
  servers: ServerConfig[];
  selectedServerId: string | null;
  onSelectServer: (id: string) => void;
  onDeleteServer: (id: string) => void;
}

const ServerList: React.FC<ServerListProps> = ({ servers, selectedServerId, onSelectServer, onDeleteServer }) => {
  return (
    <div className="w-full">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Selected Server</h2>
      <ul>
        {servers.map(server => (
          <ServerListItem 
            key={server.id}
            config={server}
            isSelected={server.id === selectedServerId}
            onSelect={onSelectServer}
            onDelete={onDeleteServer}
          />
        ))}
      </ul>
      {servers.length === 0 && (
          <p className="text-center text-gray-500 py-4">No servers configured.</p>
      )}
    </div>
  );
};

export default ServerList;
