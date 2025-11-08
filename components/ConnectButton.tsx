
import React from 'react';
import type { ConnectionStatus } from '../types';
import { PowerIcon } from '../constants';

interface ConnectButtonProps {
  status: ConnectionStatus;
  onConnect: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ status, onConnect }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'CONNECTED':
        return { text: 'CONNECTED', color: 'bg-green-500', iconColor: 'text-green-200', ringColor: 'ring-green-500/50' };
      case 'CONNECTING':
        return { text: 'CONNECTING', color: 'bg-yellow-500', iconColor: 'text-yellow-200', ringColor: 'ring-yellow-500/50' };
      case 'DISCONNECTING':
        return { text: 'DISCONNECTING', color: 'bg-red-500', iconColor: 'text-red-200', ringColor: 'ring-red-500/50' };
      default:
        return { text: 'TAP TO CONNECT', color: 'bg-gray-700', iconColor: 'text-gray-300', ringColor: 'ring-gray-600/50' };
    }
  };

  const { text, color, iconColor, ringColor } = getStatusInfo();
  const isLoading = status === 'CONNECTING' || status === 'DISCONNECTING';

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <button
        onClick={onConnect}
        disabled={isLoading}
        className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 ${ringColor} ${color} ${isLoading ? 'cursor-not-allowed' : 'hover:scale-105'}`}
      >
        <div className="absolute inset-0 rounded-full border-4 border-gray-800/50"></div>
        {isLoading && <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin"></div>}
        <PowerIcon className={`w-20 h-20 transition-colors duration-300 ${iconColor}`} />
      </button>
      <p className="mt-6 text-lg font-semibold tracking-wider text-gray-300 uppercase">{text}</p>
    </div>
  );
};

export default ConnectButton;
