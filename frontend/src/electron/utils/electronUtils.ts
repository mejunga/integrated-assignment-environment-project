import { app, BrowserWindow } from "electron";
import path from "path";
import fs from 'fs';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

const dataPath = path.join(app.getAppPath(), '..', 'data');
const selectedUserPath = path.join(dataPath, 'selected-user.json');
const usersPath = path.join(dataPath, 'users.json');
const openWindows: BrowserWindow[] = [];

let mainWindow: BrowserWindow | null = null;

export function setMainWindow(window: BrowserWindow) {
  mainWindow = window;

  window.on('closed', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      closeAllWindows();
    });
    mainWindow = null;
  });
}

export function createWindow(options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
  const win = new BrowserWindow(options);
  return win;
}

function closeAllWindows() {
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) win.close();
  });
}

export function ensureDefaultUser() {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }
  
    const defaultConfigs: Config[] = [
      {
        name: 'Java default',
        language: 'Java',
        interpreted: false,
        compile: { command: 'javac', args: ['Main.java'] },
        run: { command: 'java', args: ['Main'] }
      },
      {
        name: 'C default',
        language: 'C',
        interpreted: false,
        compile: { command: 'gcc', args: ['main.c', '-o', 'main'] },
        run: { command: './main', args: [] }
      },
      {
        name: 'C++ default',
        language: 'C++',
        interpreted: false,
        compile: { command: 'g++', args: ['main.cpp', '-o', 'main'] },
        run: { command: './main', args: [] }
      },
      {
        name: 'C# default',
        language: 'C#',
        interpreted: false,
        compile: { command: 'csc', args: ['Program.cs'] },
        run: { command: 'Program.exe', args: [] }
      },
      {
        name: 'Phyton default',
        language: 'Python',
        interpreted: true,
        run: { command: 'python', args: ['main.py'] }
      },
      {
        name: 'JavaScript default',
        language: 'JavaScript',
        interpreted: true,
        run: { command: 'node', args: ['main.js'] }
      },
      {
        name: 'Ruby default',
        language: 'Ruby',
        interpreted: true,
        run: { command: 'ruby', args: ['main.rb'] }
      },
      {
        name: 'PHP default',
        language: 'PHP',
        interpreted: true,
        run: { command: 'php', args: ['main.php'] }
      }
    ];
  
    const defaultUser: User = {
      name: 'Default User',
      id: '00000000000',
      configs: defaultConfigs,
      assignments: [],
    };
  
    let users: User[] = [];
    let shouldWriteUsers = false;
  
    if (!fs.existsSync(usersPath)) {
      shouldWriteUsers = true;
    } else {
      try {
        const content = fs.readFileSync(usersPath, 'utf-8').trim();
        if (content === '') {
          shouldWriteUsers = true;
        } else {
          users = JSON.parse(content);
          if (!Array.isArray(users) || users.length === 0) {
            shouldWriteUsers = true;
          }
        }
      } catch (err) {
        console.error('Invalid users.json:', err);
        shouldWriteUsers = true;
      }
    }
  
    if (shouldWriteUsers) {
      users = [defaultUser];
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    }
  
    let shouldWriteSelectedUser = false;
  
    if (!fs.existsSync(selectedUserPath)) {
      shouldWriteSelectedUser = true;
    } else {
      try {
        const content = fs.readFileSync(selectedUserPath, 'utf-8').trim();
        if (content === '') {
          shouldWriteSelectedUser = true;
        } else {
          const parsed = JSON.parse(content);
          if (typeof parsed === 'string') {
            const matched = users.find(u => u.id === parsed);
            if (matched) {
              fs.writeFileSync(selectedUserPath, JSON.stringify(matched, null, 2));
            } else {
              shouldWriteSelectedUser = true;
            }
          } else if (!parsed || !parsed.id) {
            shouldWriteSelectedUser = true;
          }
        }
      } catch (err) {
        console.error('Invalid selected-user.json:', err);
        shouldWriteSelectedUser = true;
      }
    }
  
    if (shouldWriteSelectedUser) {
      fs.writeFileSync(selectedUserPath, JSON.stringify(defaultUser, null, 2));
    }
}




