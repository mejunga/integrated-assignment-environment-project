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

export async function fecthAssignment(assignment: Assignment): Promise<boolean> {
  const response = await fetch('http://localhost:4040/process-assignment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(assignment)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  if (result !== true) {
    throw new Error(`Unexpected response: ${JSON.stringify(result)}`);
  }

  return true;
}