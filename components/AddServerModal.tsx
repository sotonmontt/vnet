
import React, { useState } from 'react';
import type { ServerConfig } from '../types';
import { parseVpnLink } from '../parser';
import QrCodeScanner from './QrCodeScanner';

interface AddServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddServer: (config: ServerConfig) => void;
}

type AddMode = 'clipboard' | 'qr';

const AddServerModal: React.FC<AddServerModalProps> = ({ isOpen, onClose, onAddServer }) => {
    const [mode, setMode] = useState<AddMode>('clipboard');
    const [link, setLink] = useState('');
    const [error, setError] = useState('');

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setLink(text);
            setError('');
        } catch (err) {
            setError('Failed to read from clipboard. Please paste manually.');
        }
    };

    const handleImport = () => {
        setError('');
        if (!link.trim()) {
            setError('Configuration link cannot be empty.');
            return;
        }
        const newConfig = parseVpnLink(link);
        if (newConfig) {
            onAddServer(newConfig);
            setLink('');
            onClose();
        } else {
            setError('Invalid or unsupported configuration link.');
        }
    };

    const handleScanSuccess = (scannedLink: string) => {
        const newConfig = parseVpnLink(scannedLink);
        if (newConfig) {
            onAddServer(newConfig);
            onClose();
        } else {
            setMode('clipboard');
            setError('Failed to parse QR code data. Please try again or paste manually.');
        }
    };
    
    if (!isOpen) return null;

    // Reset state on close
    const handleClose = () => {
        setLink('');
        setError('');
        setMode('clipboard');
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={handleClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Add Server</h2>
                
                <div className="flex border-b border-gray-700 mb-4">
                    <button onClick={() => setMode('clipboard')} className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'clipboard' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                        From Clipboard
                    </button>
                    <button onClick={() => setMode('qr')} className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'qr' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                        From QR Code
                    </button>
                </div>

                {mode === 'clipboard' && (
                    <div className="space-y-4">
                        <textarea
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Paste vless://, vmess://, etc."
                            className="w-full h-28 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
                            aria-label="Configuration Link Input"
                        />
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <div className="flex space-x-2">
                            <button onClick={handlePaste} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Paste
                            </button>
                            <button onClick={handleImport} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Import
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'qr' && (
                    <QrCodeScanner onScanSuccess={handleScanSuccess} onCancel={() => setMode('clipboard')} />
                )}
            </div>
        </div>
    );
};

export default AddServerModal;
