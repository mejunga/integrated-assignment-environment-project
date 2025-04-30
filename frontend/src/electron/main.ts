import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { spawn } from 'child_process';

let javaServerProcess: ReturnType<typeof spawn> | null = null;

function startJavaServer() {
  const exeDir = path.dirname(app.getPath("exe"));
  const jarPath = path.resolve(exeDir, "..", "..", "app_core", "app_core.jar");

  javaServerProcess = spawn("java", ["-jar", jarPath], {
    detached: false,
    stdio: "ignore"
  });

  console.log("✅ Java HTTP server başlatıldı.");
}

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 850,
        webPreferences: {
            preload : getPreloadPath()
        }
    });

    if(isDev()) {
        mainWindow.loadURL('http://localhost:1234');
    }else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist_react', '/index.html'));
    }

    mainWindow.setMenu(null); 
    //startJavaServer();
});

ipcMain.on("send-config", async (event, config: Config) => {
    try {
      const response = await fetch("http://localhost:8080/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
  
      const result = await response.text();
      console.log("Java'dan gelen cevap:", result);
  
      event.sender.send("processing-result", result);
    } catch (err) {
      console.error("Java sunucusuna bağlanılamadı:", err);
      event.sender.send("processing-result", "Bağlantı hatası");
    }
  });

app.on('window-all-closed', () => {
    if (javaServerProcess) {
    javaServerProcess.kill(); 
    console.log("❌ Java server kapatıldı.");
    }
    app.quit();
});
