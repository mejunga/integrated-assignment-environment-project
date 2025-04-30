package com.example.appcore.utils;

import java.io.File;
import java.io.IOException;

public class ExecutionManager {
    public boolean compile(Configuration config, File sourceFile) {
        String compileCmd = config.getCompileCommand(sourceFile);
        return runCommand(compileCmd);
    }

    public boolean execute(Configuration config, File executable, String[] args) {
        String runCmd = config.getRunCommand(executable, args);
        return runCommand(runCmd);
    }

    private boolean runCommand(String command) {
        try {
            Process proc = Runtime.getRuntime().exec(command);
            proc.waitFor();
            return proc.exitValue() == 0;
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }
}
