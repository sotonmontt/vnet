
import React from 'react';
import type { Traffic, ConnectionStatus } from '../types';

interface StatusBarProps {
    traffic: Traffic;
    connectedTime: number;
    status: ConnectionStatus;
}

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const StatItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-lg font-semibold text-white">{value}</span>
    </div>
);

const StatusBar: React.FC<StatusBarProps> = ({ traffic, connectedTime, status }) => {
    const isConnected = status === 'CONNECTED';

    return (
        <div className="w-full bg-gray-800/50 p-4 rounded-lg mt-4 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
                <StatItem label="Download" value={isConnected ? formatBytes(traffic.down) : '-'} />
                <StatItem label="Upload" value={isConnected ? formatBytes(traffic.up) : '-'} />
                <StatItem label="Duration" value={isConnected ? formatTime(connectedTime) : '--:--:--'} />
            </div>
        </div>
    );
};

export default StatusBar;
