const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    sendConfig: (config: Config) => electron.ipcRenderer.send('send-config', (config)),
    
} satisfies Window['electron']);