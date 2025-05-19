import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import { ensureDefaultUser, isDev, createWindow, setMainWindow } from './utils/electronUtils.js';
import { getPreloadPath, getDataPath } from './utils/pathResolver.js';
import { fecthAssignment, startJavaServer, stopServer } from './utils/serverUtils.js';

let selectedAssignmentTitle: string | null = null;
let selectedUserName: string | null = null;
let configWindow: BrowserWindow | null = null;

const selectedUserPath = path.join(getDataPath(), 'selected-user.json');
const usersPath = path.join(getDataPath(), 'users.json');
const zipFolderPath = path.join(getDataPath(), 'users', selectedUserName!, selectedAssignmentTitle!);

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

ipcMain.handle('rename-zip-file', async (_event, oldName: string, newName: string) => {
  try {
    const selectedAssignment = getSelectedAssignmentTitleSomehow(); // Uygun şekilde al
    const folder = path.join(zipBasePath, selectedAssignment);
    const oldPath = path.join(folder, oldName);
    const newPath = path.join(folder, newName);

    if (!fs.existsSync(oldPath)) {
      return { success: false, message: 'Old file does not exist' };
    }

    fs.renameSync(oldPath, newPath);
    return { success: true };
  } catch (err) {
    console.error('Rename error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-zip-file', async (_event, zipName: string) => {
  try {
    const folder = path.join(zipBasePath, selectedAssignmentTitle);
    const zipPath = path.join(folder, zipName);

    if (fs.existsSync(zipPath)) {
      fs.rmSync(zipPath, { recursive: true, force: true });
      return { success: true };
    } else {
      return { success: false, message: 'File not found' };
    }
  } catch (err) {
    console.error('Delete error:', err);
    return { success: false, error: err.message };
  }
});

  ipcMain.handle('open-zip-folder', (_event, zipName: string) => {
  const zipPath = path.join(zipFolderPath, zipName + '.zip');

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
    return { success: true };
  }
  return { success: false, error: "Unknown error occurred" };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    dialog.showErrorBox("Server Error", `Could not send data to server:\n${errorMessage}`);
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