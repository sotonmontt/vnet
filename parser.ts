
import { Protocol } from './constants';
import type { ServerConfig } from './types';

// This is a MOCK parser. It does not perform real parsing but simulates it
// based on the link prefix.
export const parseVpnLink = (link: string): ServerConfig | null => {
    try {
        const trimmedLink = link.trim();
        if (trimmedLink.startsWith('vless://')) {
            const name = `VLESS-${Math.random().toString(36).substring(2, 8)}`;
            return {
                id: crypto.randomUUID(),
                name: name,
                protocol: Protocol.VLESS,
                address: 'parsed.server.com',
                port: 443,
                details: { id: 'parsed-uuid', security: 'tls', network: 'ws', path: '/vless' },
            };
        } else if (trimmedLink.startsWith('vmess://')) {
            // In a real app, you would decode the base64 part of the link
            const name = `VMess-${Math.random().toString(36).substring(2, 8)}`;
            return {
                id: crypto.randomUUID(),
                name: name,
                protocol: Protocol.VMESS,
                address: 'parsed.vmess.com',
                port: 8443,
                details: { id: 'parsed-uuid-vmess', security: 'auto', network: 'tcp' },
            };
        } else if (trimmedLink.startsWith('trojan://')) {
            const name = `Trojan-${Math.random().toString(36).substring(2, 8)}`;
            return {
                id: crypto.randomUUID(),
                name: name,
                protocol: Protocol.TROJAN,
                address: 'parsed.trojan.org',
                port: 443,
                details: { password: 'parsed-password' },
            };
        }
        return null; // Unsupported format
    } catch (error) {
        console.error("Failed to parse VPN link:", error);
        return null;
    }
};
