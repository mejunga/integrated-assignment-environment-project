const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    getSelectedUser: (callback: (event: any, user: User) => void) => electron.ipcRenderer.on("selected-user", callback),
    requestSelectedUser: () => electron.ipcRenderer.send("request-selected-user"),
    changeSelectedUser: (user: User) => electron.ipcRenderer.send("change-selected-user", user),
    removeSelectedUserListener: (callback: (event: any, user: User) => void) => electron.ipcRenderer.removeListener("selected-user", callback),
    openConfigurationsWindow: () => electron.ipcRenderer.send('open-configurations-window'),
    updateSelectedUserConfigs: (configs: Config[]) => electron.ipcRenderer.send("update-selected-user-configs", configs),
    syncSelectedUserToUsers: () => electron.ipcRenderer.send("sync-selected-user-to-users"),
    addConfig: (config: Config) => electron.ipcRenderer.invoke('add-config', config),
    openNewAssignmentWindow: () => electron.ipcRenderer.send('open-new-assignment-window'),
    openConfigurationsWindowWithSource: (source: string) => electron.ipcRenderer.send('open-configurations-window', source),
    addAssignment: (assignment: Assignment) => electron.ipcRenderer.invoke('add-assignment', assignment),
    closeCurrentWindow: () => electron.ipcRenderer.send('close-current-window'),
    getWindowSource: (callback: (source: string | null) => void) => {
        const arg = process.argv.find((a) => a.startsWith('--source='));
        const source = arg ? arg.split('=')[1] : null;
        callback(source);
      },
    
} satisfies Window['electron']);