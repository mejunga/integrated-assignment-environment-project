package com.example.appcore.utils;

import java.io.*;

public class ExecutionManager {

    public boolean compile(Configuration config, File sourceFile) {
        String compileCmd = config.getCompileCommand(sourceFile);

        if (compileCmd == null || compileCmd.trim().isEmpty() || compileCmd.trim().equals("-")) {
            System.out.println("No compilation step required.");
            return true;  // Skip compilation for interpreted languages
        }

        System.out.println("Compiling with command: " + compileCmd);
        return runCommand(compileCmd, sourceFile.getParentFile());
    }

    public boolean execute(Configuration config, File sourceFile, String[] args) {
        File execFile = getExecutableFromSource(sourceFile, config);
        String command = config.getRunCommand(execFile, args);

        System.out.println("Executing with command: " + command);
        return runCommand(command, sourceFile.getParentFile());
    }

    private boolean runCommand(String command, File workingDir) {
        try {
            ProcessBuilder builder = new ProcessBuilder("cmd", "/c", command);
            builder.directory(workingDir);
            builder.redirectErrorStream(true);

            File outputFile = new File(workingDir, "output.txt");
            builder.redirectOutput(outputFile);

            Process proc = builder.start();
            int exitCode = proc.waitFor();
            System.out.println("Process exited with code: " + exitCode);

            return exitCode == 0;

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }


    private File getExecutableFromSource(File sourceFile, Configuration config) {
        String sourceName = sourceFile.getName();
        String baseName = sourceName.substring(0, sourceName.lastIndexOf('.'));

        if (sourceName.endsWith(".c") || sourceName.endsWith(".cpp")) {
            return new File(sourceFile.getParent(), baseName);
        } else if (sourceName.endsWith(".java")) {
            return new File(sourceFile.getParent(), baseName + ".class");
        } else {
            return sourceFile;  // For interpreted scripts
        }
    }
}
