import { contextBridge } from 'electron';

// Expose only what the renderer needs. Add new capabilities here, one by one.
contextBridge.exposeInMainWorld('desktop', { platform: process.platform });
