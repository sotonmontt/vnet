
import { Protocol } from './constants';

export interface ServerConfig {
  id: string;
  name: string;
  protocol: Protocol;
  address: string;
  port: number;
  details: {
    id?: string;
    security?: string;
    network?: string;
    path?: string;
    password?: string;
    method?: string;
  };
}

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTING';

export interface Settings {
  doh: string;
  enableIPV6: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export type Screen = 'home' | 'settings';

export interface Traffic {
  up: number; // in KB
  down: number; // in KB
}
