const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    requestSelectedUser: () => electron.ipcRenderer.send("request-selected-user"),
    getSelectedUser: (callback: (event: any, user: User) => void) => electron.ipcRenderer.on("selected-user", callback),
    removeSelectedUserListener: (callback: (event: any, user: User) => void) => electron.ipcRenderer.removeListener("selected-user", callback),
    updateSelectedUserConfigs: (configs: Config[]) => electron.ipcRenderer.send("update-selected-user-configs", configs),
    syncSelectedUserToUsers: () => electron.ipcRenderer.send("sync-selected-user-to-users"),
    changeSelectedUser: (user: User) => electron.ipcRenderer.send("change-selected-user", user),

    setSelectedAssignment: (title: string) => electron.ipcRenderer.send('set-selected-assignment', title),
    getSelectedAssignment: (callback: (event: any, title: string) => void) => electron.ipcRenderer.on('get-selected-assignment', callback),
    requestSelectedAssignment: () => electron.ipcRenderer.send('request-selected-assignment'),
    removeSelectedAssignmentListener: (callback: any) => electron.ipcRenderer.removeListener('get-selected-assignment', callback),
    onAssignmentListRefresh: (callback: () => void) => electron.ipcRenderer.on('refresh-assignment-list', callback),
    removeAssignmentListRefreshListener: (callback: () => void) => electron.ipcRenderer.removeListener('refresh-assignment-list', callback),
    selectTxtFile: () => electron.ipcRenderer.invoke('dialog:select-txt-file'),
    openNewAssignmentWindow: () => electron.ipcRenderer.send('open-new-assignment-window'),
    deleteAssignment: (title: string) => electron.ipcRenderer.invoke('delete-assignment', title),


    addConfig: (config: Config) => electron.ipcRenderer.invoke('add-config', config),
    openConfigurationsWindow: () => electron.ipcRenderer.send('open-configurations-window'),
    addAssignment: (assignment: Assignment) => electron.ipcRenderer.invoke('add-assignment', assignment),
    closeCurrentWindow: () => electron.ipcRenderer.send('close-current-window'),
    importZipFiles: (assignmentTitle: string | null) => electron.ipcRenderer.invoke('import-zip-files', assignmentTitle),
    
    requestZipFileNames: () => electron.ipcRenderer.send('request-zip-file-names'),
    getZipFileNames: (callback: (event: any, zipNames: string[]) => void) => electron.ipcRenderer.on('get-zip-file-names', callback),
    removeZipFileNameListener: (callback: (event: any, zipNames: string[]) => void) => electron.ipcRenderer.on('get-zip-file-names', callback),
    openZipFolder: (zipName: string) => electron.ipcRenderer.invoke('open-zip-folder', zipName),
    deleteZipFile: (zipName: string) => electron.ipcRenderer.invoke('delete-zip-file', zipName),

    exportResults: () => electron.ipcRenderer.invoke('export-results'),
    importConfigsFromJson: async () => electron.ipcRenderer.invoke('import-configs-from-json'),
    exportConfigsToJson: async () => electron.ipcRenderer.invoke('export-configs-to-json'),
    openUserManual: async () => electron.ipcRenderer.invoke('open-user-manual'),

} satisfies Window['electron']);