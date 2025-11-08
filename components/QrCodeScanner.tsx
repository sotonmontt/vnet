
import React, { useEffect, useState } from 'react';
import { QrCodeIcon } from '../constants';

interface QrCodeScannerProps {
  onScanSuccess: (text: string) => void;
  onCancel: () => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onScanSuccess, onCancel }) => {
  const [message, setMessage] = useState('Position the QR code inside the frame');

  useEffect(() => {
    setMessage('Scanning...');
    const timer = setTimeout(() => {
      // Simulate a successful scan with a mock VLESS link
      onScanSuccess('vless://e2a8c3b7-f6d1-4e8a-9a4c-1d8b9e6f0a3c@new.server.com:443?security=tls&type=ws&path=%2Fvless#Scanned-Config-01');
    }, 3000);

    return () => clearTimeout(timer);
  }, [onScanSuccess]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg">
      <div className="relative w-64 h-64 bg-black rounded-lg overflow-hidden border-4 border-gray-600">
        {/* Mock camera view */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <QrCodeIcon className="w-24 h-24 text-gray-700" />
        </div>
        {/* Scanning line animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_2px_rgba(0,255,255,0.7)] animate-scan-line"></div>
      </div>
      <p className="mt-4 text-white">{message}</p>
      <button onClick={onCancel} className="mt-4 text-sm text-gray-400 hover:text-white">Cancel</button>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
        .animate-scan-line {
          animation: scan-line 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QrCodeScanner;
