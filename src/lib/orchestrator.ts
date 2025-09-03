import { writable, type Writable } from 'svelte/store';
import type { WebSocket } from 'ws';
import YAML from 'yaml';

export interface OrchestratorConfig {
  websocketUrl?: string;
  apiBaseUrl?: string;
  hooks?: Record<string, Function[]>;
}

export interface StateStore {
  [key: string]: any;
}

export interface FileUpload {
  name: string;
  content: string;
  type: 'json' | 'yaml' | 'csv';
  data?: any;
}

export class Orchestrator {
  private static instance: Orchestrator;
  private config: OrchestratorConfig;
  private store: Writable<StateStore> = writable({});
  private websocket: WebSocket | null = null;
  private hooks: Record<string, Function[]> = {};
  private middleware: Function[] = [];

  private constructor(config: OrchestratorConfig = {}) {
    this.config = config;
    this.initializeHooks();
  }

  public static getInstance(config?: OrchestratorConfig): Orchestrator {
    if (!Orchestrator.instance) {
      Orchestrator.instance = new Orchestrator(config);
    }
    return Orchestrator.instance;
  }

  private initializeHooks(): void {
    this.hooks = {
      beforeStateUpdate: [],
      afterStateUpdate: [],
      websocketConnect: [],
      websocketDisconnect: [],
      fileUpload: [],
      apiRequest: [],
      ...this.config.hooks
    };
  }

  public getStore(): Writable<StateStore> {
    return this.store;
  }

  public setState(key: string, value: any): void {
    this.runHooks('beforeStateUpdate', { key, value });
    
    this.store.update(state => {
      const newState = { ...state, [key]: value };
      this.runHooks('afterStateUpdate', { key, value, newState });
      return newState;
    });
  }

  public getState(key?: string): Promise<any> {
    return new Promise((resolve) => {
      this.store.subscribe(state => {
        resolve(key ? state[key] : state);
      })();
    });
  }

  public addHook(event: string, callback: Function): void {
    if (!this.hooks[event]) {
      this.hooks[event] = [];
    }
    this.hooks[event].push(callback);
  }

  public addMiddleware(middleware: Function): void {
    this.middleware.push(middleware);
  }

  private runHooks(event: string, data?: any): void {
    if (this.hooks[event]) {
      this.hooks[event].forEach(callback => callback(data));
    }
  }

  private applyMiddleware(data: any): any {
    return this.middleware.reduce((result, middleware) => middleware(result), data);
  }

  public connectWebSocket(url?: string): void {
    const wsUrl = url || this.config.websocketUrl;
    if (!wsUrl) throw new Error('WebSocket URL not provided');

    if (typeof window !== 'undefined' && 'WebSocket' in window) {
      this.websocket = new window.WebSocket(wsUrl) as any;
      
      this.websocket.onopen = () => {
        this.runHooks('websocketConnect', { url: wsUrl });
      };

      this.websocket.onmessage = (event) => {
        const data = this.applyMiddleware(JSON.parse(event.data));
        this.setState('websocketData', data);
      };

      this.websocket.onclose = () => {
        this.runHooks('websocketDisconnect', { url: wsUrl });
      };
    }
  }

  public disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  public async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const baseUrl = this.config.apiBaseUrl || '';
    const url = `${baseUrl}${endpoint}`;
    
    this.runHooks('apiRequest', { url, options });

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.applyMiddleware(data);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  public parseFile(content: string, type: 'json' | 'yaml' | 'csv'): any {
    try {
      switch (type) {
        case 'json':
          return JSON.parse(content);
        
        case 'yaml':
          return YAML.parse(content);
        
        case 'csv':
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj: Record<string, string> = {};
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
            });
            return obj;
          });
          return data;
        
        default:
          throw new Error(`Unsupported file type: ${type}`);
      }
    } catch (error) {
      console.error('File parsing error:', error);
      throw error;
    }
  }

  public async handleFileUpload(file: File): Promise<FileUpload> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const extension = file.name.split('.').pop()?.toLowerCase();
          let type: 'json' | 'yaml' | 'csv';

          switch (extension) {
            case 'json':
              type = 'json';
              break;
            case 'yml':
            case 'yaml':
              type = 'yaml';
              break;
            case 'csv':
              type = 'csv';
              break;
            default:
              throw new Error(`Unsupported file type: ${extension}`);
          }

          const parsedData = this.parseFile(content, type);
          const fileUpload: FileUpload = {
            name: file.name,
            content,
            type,
            data: parsedData
          };

          this.runHooks('fileUpload', fileUpload);
          this.setState('uploadedFile', fileUpload);
          
          resolve(fileUpload);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  }

  public exportState(format: 'json' | 'yaml' = 'json'): string {
    return new Promise((resolve) => {
      this.store.subscribe(state => {
        if (format === 'yaml') {
          resolve(YAML.stringify(state));
        } else {
          resolve(JSON.stringify(state, null, 2));
        }
      })();
    }) as any;
  }

  public reset(): void {
    this.store.set({});
    this.disconnectWebSocket();
    this.hooks = {};
    this.middleware = [];
    this.initializeHooks();
  }
}

export const orchestrator = Orchestrator.getInstance();
export default orchestrator;