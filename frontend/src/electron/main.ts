import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { ensureDefaultUser, isDev, createWindow, setMainWindow } from './utils/electronUtils.js';
import { getPreloadPath, getDataPath, getUserManualPath } from './utils/pathResolver.js';
import { fecthAssignment, startJavaServer, stopServer } from './utils/serverUtils.js';

let selectedAssignmentTitle: string | null = null;
let selectedUserName: string | null = null;
let configWindow: BrowserWindow | null = null;

const selectedUserPath = path.join(getDataPath(), 'selected-user.json');
const usersPath = path.join(getDataPath(), 'users.json');

app.on('ready', () => {
  const mainWindow = createWindow({
    width: 1400,
    height: 850,
    title: 'Integrated Assignment Environment',
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  setMainWindow(mainWindow);
  ensureDefaultUser();

  if (isDev()) {
    mainWindow.loadURL('http://localhost:1234/#/');
  } else {
    startJavaServer();
    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${path.join(app.getAppPath(), 'dist_react', 'index.html')}#/`);
  }

});

ipcMain.on('set-selected-assignment', (_, title: string) => {
  selectedAssignmentTitle = title;
  const allWindows = BrowserWindow.getAllWindows();
    for (const win of allWindows) {
      if (win.webContents.getURL().includes('#/')) {
        win.webContents.send('get-selected-assignment', selectedAssignmentTitle);
      }
    }
});

ipcMain.handle('open-user-manual', async () => {
  try {
    const manualPath = getUserManualPath()
    await shell.openPath(manualPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
});

ipcMain.on('request-selected-assignment', (event) => {
  event.sender.send('get-selected-assignment', selectedAssignmentTitle);
});

ipcMain.on("request-selected-user", (event) => {
  const user = JSON.parse(fs.readFileSync(selectedUserPath, 'utf-8'));
  selectedUserName = user.name;
  event.sender.send("selected-user", user);
});

ipcMain.on("change-selected-user", (event, user) => {
  fs.writeFileSync(selectedUserPath, JSON.stringify(user, null, 2));
  event.sender.send("selected-user", user);
});

ipcMain.on('open-configurations-window', () => {
  if (configWindow && !configWindow.isDestroyed()) {
    configWindow.focus();
    return;
  }
  
  configWindow = createWindow({
    width: 550,
    height: 650,
    title: 'Configurations',
    resizable: false,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev()) {
    configWindow.loadURL('http://localhost:1234/#/configurations');
  }else {
    configWindow.loadURL(`file://${path.join(app.getAppPath(), 'dist_react', 'index.html')}#/configurations`);
  }

  configWindow.on('closed', () => {
    configWindow = null;
  });
  configWindow.setMenu(null);
});

ipcMain.handle('import-configs-from-json', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select a JSON file with configurations',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile']
  });

  if (canceled || filePaths.length === 0) {
    return { success: false };
  }

  try {
    const fileContent = fs.readFileSync(filePaths[0], 'utf-8');
    const importedConfigs: Config[] = JSON.parse(fileContent);

    if (!Array.isArray(importedConfigs)) throw new Error('Invalid structure');

    const userDataRaw = fs.readFileSync(selectedUserPath, 'utf-8');
    const userData = JSON.parse(userDataRaw);

    const existingConfigs: Config[] = userData.configs ?? [];

    const mergedConfigs = [
      ...importedConfigs,
      ...existingConfigs.filter(
        existing => !importedConfigs.some(imp => imp.name === existing.name)
      )
    ];

    userData.configs = mergedConfigs;

    fs.writeFileSync(selectedUserPath, JSON.stringify(userData, null, 2));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
});

ipcMain.handle('export-configs-to-json', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export Configurations',
    defaultPath: 'configs.json',
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  try {
    const userDataRaw = fs.readFileSync(selectedUserPath, 'utf-8');
    const userData = JSON.parse(userDataRaw);

    const configs: Config[] = userData.configs ?? [];

    fs.writeFileSync(filePath, JSON.stringify(configs, null, 2));
    return { success: true };
  } catch (err) {
    return { success: false };
  }
});

ipcMain.handle('delete-zip-file', async (_event, zipName: string) => {
  try {
    if (!selectedUserName || !selectedAssignmentTitle) {
      throw new Error("User or assignment not selected.");
    }

    const zipPath = path.join(getDataPath(), 'users', selectedUserName!, selectedAssignmentTitle!, zipName + '.zip');

    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
        const allWindows = BrowserWindow.getAllWindows();
        const dir = path.join(getDataPath(), 'users', selectedUserName, selectedAssignmentTitle);
        const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.zip')).map(f => f.slice(0, -4));

        for (const win of allWindows) {
          if (win.webContents.getURL().includes('#/')) {
            if (!fs.existsSync(dir)) {
              win.webContents.send('get-zip-file-names', []);
              return;
            }
            win.webContents.send('get-zip-file-names', files);
          }
        }
      return { success: true };
    }else {
      return { success: false, error: 'ZIP file not found.' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
});

ipcMain.on('open-new-assignment-window', () => {
  const newAssignmentWindow = createWindow({
    width: 550,
    height: 750,
    title: 'New Assignment',
    resizable: false,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev()) {
    newAssignmentWindow.loadURL('http://localhost:1234/#/new-assignment');
  } else {
    newAssignmentWindow.loadURL(`file://${path.join(app.getAppPath(), 'dist_react', 'index.html')}#/new-assignment`);
  }

  newAssignmentWindow.setMenu(null);
});

  ipcMain.handle('open-zip-folder', (_event, zipName: string) => {
  const zipPath = path.join(getDataPath(), 'users', selectedUserName!, selectedAssignmentTitle!, zipName + '.zip');

  return shell.openPath(zipPath);
});

ipcMain.on("sync-selected-user-to-users", (_) => {
  try {
    const selectedUserRaw = fs.readFileSync(selectedUserPath, 'utf-8');
    const usersRaw = fs.readFileSync(usersPath, 'utf-8');

    const selectedUser: User = JSON.parse(selectedUserRaw);
    const users: User[] = JSON.parse(usersRaw);

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? { ...selectedUser } : user
    );

    fs.writeFileSync(usersPath, JSON.stringify(updatedUsers, null, 2));
  } catch (err) {
    console.error("Failed to sync selected user to users.json:", err);
  }
});

ipcMain.handle('add-assignment', async (_, newAssignment: Assignment) => {
  try {
    const selectedUserRaw = fs.readFileSync(selectedUserPath, 'utf-8');
    const usersRaw = fs.readFileSync(usersPath, 'utf-8');

    const selectedUser: User = JSON.parse(selectedUserRaw);
    const users: User[] = JSON.parse(usersRaw);

    selectedUser.assignments = selectedUser.assignments || [];
    selectedUser.assignments.push(newAssignment);
    fs.writeFileSync(selectedUserPath, JSON.stringify(selectedUser, null, 2));

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, assignments: [...(user.assignments || []), newAssignment] }
        : user
    );
    fs.writeFileSync(usersPath, JSON.stringify(updatedUsers, null, 2));

    const allWindows = BrowserWindow.getAllWindows();
    for (const win of allWindows) {
      if (win.webContents.getURL().includes('#/')) {
        win.webContents.send('refresh-assignment-list');
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
});

ipcMain.handle('set-selected-user', (_event, username: string) => {
  selectedUserName = username;
});

ipcMain.handle('delete-assignment', async (_event, title: string) => {
  try {
    if (!selectedUserName) {
      throw new Error('No user selected');
    }

    const assignmentDir = path.join(getDataPath(), 'users', selectedUserName, title);

    if (!fs.existsSync(assignmentDir)) {
      console.warn('Assignment directory not found:', assignmentDir);
      return false;
    }

    fs.rmSync(assignmentDir, { recursive: true, force: true });

    const selectedUser: User = JSON.parse(fs.readFileSync(selectedUserPath, 'utf-8'));
    selectedUser.assignments = (selectedUser.assignments || []).filter(a => a.title !== title);
    fs.writeFileSync(selectedUserPath, JSON.stringify(selectedUser, null, 2));

    const users: User[] = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, assignments: selectedUser.assignments }
        : user
    );
    fs.writeFileSync(usersPath, JSON.stringify(updatedUsers, null, 2));

    return true;
  } catch (err) {
    console.error('Error while deleting assignment:', err);
    return false;
  }
});

ipcMain.handle('export-results', async () => {
  const userDir = path.join(getDataPath(), 'users', selectedUserName!);
  const assignmentDir = path.join(userDir, selectedAssignmentTitle!);

  if (!fs.existsSync(userDir) || !fs.existsSync(assignmentDir)) {
    return { success: false, error: 'Selected user or assignment not found.' };
  }

  const zipFiles = fs.readdirSync(assignmentDir).filter(name => name.endsWith('.zip'));

  if (zipFiles.length === 0) {
    return { success: false, error: 'No zip files found.' };
  }

  const tempDir = path.join(assignmentDir, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const results: Record<string, any>[] = [];

  for (const zipName of zipFiles) {
    const zipPath = path.join(assignmentDir, zipName);
    const tempExtractPath = path.join(tempDir, zipName.replace('.zip', ''));

    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(tempExtractPath, true);

      const resultPath = path.join(tempExtractPath, 'result.json');
      if (fs.existsSync(resultPath)) {
        const content = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
        results.push(content);
      }
    } catch (e) {
      console.warn(`Failed to extract or read ${zipName}:`, e);
    }
  }

  if (results.length === 0) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    return { success: false, error: 'No results found in any zip files.' };
  }

  const allKeys = Array.from(
    new Set(results.flatMap(obj => Object.keys(obj)))
  );
  const escape = (value: any) => `"${String(value).replace(/"/g, '""')}"`;
  const csvLines = [
    allKeys.map(escape).join(';'), 
    ...results.map(obj => allKeys.map(k => escape(obj[k] ?? '')).join(';')) 
  ];

  const csvContent = csvLines.join('\n');

  const { filePath } = await dialog.showSaveDialog({
    title: 'Save Results as CSV',
    defaultPath: `results-${selectedAssignmentTitle}.csv`,
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  });

  if (filePath) {
    fs.writeFileSync(filePath, csvContent, 'utf-8');
  }

  fs.rmSync(tempDir, { recursive: true, force: true });

  return filePath ? { success: true } : { success: false, error: 'Save cancelled' };
});

ipcMain.on('request-zip-file-names', (event) => {
  try {
    if (!selectedUserName || !selectedAssignmentTitle) {
      event.sender.send('get-zip-file-names', []);
      return;
    }
    const dir = path.join(getDataPath(), 'users', selectedUserName, selectedAssignmentTitle);

    if (!fs.existsSync(dir)) {
      event.sender.send('get-zip-file-names', []);
      return;
    }

    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.zip')).map(f => f.slice(0, -4));
    event.sender.send('get-zip-file-names', files);
  } catch (err) {
    console.error(err);
    event.sender.send('get-zip-file-names', []);
  }
});

ipcMain.handle('dialog:select-txt-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

ipcMain.handle('add-config', async (_, config: Config) => {
  try {
    const selectedUser: User = JSON.parse(fs.readFileSync(selectedUserPath, 'utf-8'));

    const configExists = selectedUser.configs?.some(c => c.name === config.name);
    if (configExists) {
      return { success: false, error: 'A configuration with this name already exists.' };
    }

    if (!selectedUser.configs) selectedUser.configs = [];

    selectedUser.configs.push(config);

    fs.writeFileSync(selectedUserPath, JSON.stringify(selectedUser, null, 2));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
});

ipcMain.handle('import-zip-files', async (_, assignmentTitle: string) => {
  const selectedUser: User = JSON.parse(fs.readFileSync(selectedUserPath, 'utf-8'));
  const assignment = selectedUser.assignments?.find(a => a.title === assignmentTitle);

  if (!assignment) {
    throw new Error(`Assignment with title "${assignmentTitle}" not found.`);
  }

  const result = await dialog.showOpenDialog({
    title: 'Select ZIP file(s)',
    filters: [{ name: 'ZIP files', extensions: ['zip'] }],
    properties: ['openFile', 'multiSelections']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const destDir = path.join(getDataPath(), 'users', selectedUser.name, assignmentTitle);
  fs.mkdirSync(destDir, { recursive: true });

  const copiedPaths: string[] = [];
  for (const zipPath of result.filePaths) {
    const destPath = path.join(destDir, path.basename(zipPath));
    fs.copyFileSync(zipPath, destPath);
    copiedPaths.push(destPath);
  }

  const assignmentToSend: Assignment = {
    title: assignment.title,
    config: assignment.config,
    inputFile: assignment.inputFile,
    expectedOutputFile: assignment.expectedOutputFile,
    compareOptions: assignment.compareOptions,
    path: copiedPaths,
  };

  try {
  const success = await fecthAssignment(assignmentToSend);
  if (success) {
    const allWindows = BrowserWindow.getAllWindows();
    const dir = path.join(getDataPath(), 'users', selectedUserName!, selectedAssignmentTitle!);
    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.zip')).map(f => f.slice(0, -4));
    for (const win of allWindows) {
      if (win.webContents.getURL().includes('#/')) {
        if (!fs.existsSync(dir)) {
          win.webContents.send('get-zip-file-names', []);
          return;
        }
        win.webContents.send('get-zip-file-names', files);
      }
    }
    return { success: true };
  }
  return { success: false, error: "Unknown error occurred" };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    dialog.showErrorBox("Server Error", `Could not send data to server:\n${errorMessage}`);
        const allWindows = BrowserWindow.getAllWindows();
    const dir = path.join(getDataPath(), 'users', selectedUserName!, selectedAssignmentTitle!);
    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.zip')).map(f => f.slice(0, -4));
    for (const win of allWindows) {
      if (win.webContents.getURL().includes('#/')) {
        if (!fs.existsSync(dir)) {
          win.webContents.send('get-zip-file-names', []);
          return;
        }
        win.webContents.send('get-zip-file-names', files);
      }
    }
    return { success: false, error: errorMessage };
  }
});

ipcMain.on('close-current-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

app.on('window-all-closed', () => {
  stopServer();
  app.quit();
});