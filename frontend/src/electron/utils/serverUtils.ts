import { spawn } from "child_process";
import path from "path";

let javaServerProcess: ReturnType<typeof spawn> | null = null;

export function startJavaServer() {
    const exePath = path.join(process.resourcesPath, "..", "core", "core.exe");
  
    javaServerProcess = spawn(exePath, {
        detached: false,
        stdio: "ignore"
    });
}

export function stopServer() {
    if (javaServerProcess) {
        javaServerProcess.kill();
        javaServerProcess = null;
    }
}