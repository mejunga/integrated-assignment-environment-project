import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { ensureDefaultUser, isDev, createWindow, setMainWindow } from './utils/electronUtils.js';
import { getPreloadPath } from './utils/pathResolver.js';
import { startJavaServer, stopServer } from './utils/serverUtils.js';

const dataPath = path.join(app.getAppPath(), '..', 'data');
const selectedUserPath = path.join(dataPath, 'selected-user.json');
const usersPath = path.join(dataPath, 'users.json');


let configWindow: BrowserWindow | null = null;

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

  startJavaServer();
  ensureDefaultUser();

  if (isDev()) {
    mainWindow.loadURL('http://localhost:1234/#/');
  } else {
    mainWindow.loadURL(`file://${path.join(app.getAppPath(), 'dist_react', 'index.html')}#/`);
  }

  //----------Test----------
  setTimeout(() => {
    mainWindow.setMenu(null);
    sendConfigToServer(
      {
        name: 'Java default',
        language: 'Java',
        interpreted: false,
        compile: { command: 'javac', args: ['*.java'] },
        run: { command: 'java', args: ['Main'] }
      }
    );
  }, 5000);
  
  //-------------------------
});

ipcMain.on("request-selected-user", (event) => {
  const user = JSON.parse(fs.readFileSync(selectedUserPath, 'utf-8'));
  event.sender.send("selected-user", user);
});

ipcMain.on("change-selected-user", (event, user) => {
  fs.writeFileSync(selectedUserPath, JSON.stringify(user, null, 2));
  event.sender.send("selected-user", user);
});

ipcMain.on('open-configurations-window', (_, source: string | null = null) => {
  if (configWindow && !configWindow.isDestroyed()) {
    configWindow.focus();
    return;
  }

  configWindow = createWindow({
    width: 550,
    height: 730,
    title: 'Configurations',
    resizable: false,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
      additionalArguments: source ? [`--source=${source}`] : [],
    },
  });

  if (isDev()) {
    configWindow.loadURL('http://localhost:1234/#/configurations');
  } else {
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
    height: 600,
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

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
});


ipcMain.removeHandler('add-config');
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


//-------Test----------

const sendConfigToServer = async (config: Config) => {
  try {
    const response = await fetch("http://localhost:8080/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${text}`);
    }

    const responseBody = await response.text();
    console.log("Server response:", responseBody);
  } catch (err) {
    console.error("Failed to send config:", err);
  }
};