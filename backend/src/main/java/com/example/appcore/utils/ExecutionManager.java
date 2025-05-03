package com.example.appcore.utils;

import java.io.*;

public class ExecutionManager {

    public boolean compile(Configuration config, File sourceFile) {
        String compileCmd = "javac \"" + sourceFile.getAbsolutePath() + "\"";
        System.out.println("Compiling with command: " + compileCmd);
        return runCommand(compileCmd, sourceFile.getParentFile());
    }

    public boolean execute(Configuration config, File sourceFile, String[] args) {
        String className = sourceFile.getName().replace(".java", "");
        String command = "java -cp . " + className;

        System.out.println("Executing with command: " + command);
        return runCommand(command, sourceFile.getParentFile());
    }

    private boolean runCommand(String command, File workingDir) {
        try {
            String[] commandParts = command.split(" ");
            ProcessBuilder builder = new ProcessBuilder(commandParts);
            builder.directory(workingDir);
            builder.redirectErrorStream(true);
            Process proc = builder.start();

            // Print output and errors
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(proc.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("[Process Output] " + line);
                }
            }

            int exitCode = proc.waitFor();
            System.out.println("Process exited with code: " + exitCode);
            return exitCode == 0;

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }
}
