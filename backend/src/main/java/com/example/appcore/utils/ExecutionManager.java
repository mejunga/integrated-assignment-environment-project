package com.example.appcore.utils;

import java.io.*;
import java.util.List;
import java.util.ArrayList;

public class ExecutionManager {

    public boolean compile(Configuration config, File sourceFile, File outputExecutable) {
        String cmd = config.getCompileCommand(sourceFile, outputExecutable);
        if (cmd == null) {
            System.out.println("No compilation needed for: " + config.getLanguage());
            return true;
        }
        return runCommand(cmd, sourceFile.getParentFile()) != null;
    }

    public String execute(Configuration config, File execFile, String[] args) {
        String command = config.getRunCommand(execFile, args);
        return runCommand(command, execFile.getParentFile());
    }

    public boolean compareOutput(String actualOutput, File expectedOutputFile) {
        try {
            String expected = new String(java.nio.file.Files.readAllBytes(expectedOutputFile.toPath())).trim();
            return expected.equals(actualOutput.trim());
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    private String runCommand(String command, File workingDir) {
        try {
            ProcessBuilder builder = new ProcessBuilder(command.split(" "));
            builder.directory(workingDir);
            builder.redirectErrorStream(true);

            Process process = builder.start();
            StringBuilder output = new StringBuilder();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append(System.lineSeparator());
                }
            }

            int exitCode = process.waitFor();
            System.out.println("Command exited with: " + exitCode);
            return exitCode == 0 ? output.toString() : null;

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return null;
        }
    }

    private List<String> parseCommand(String command) {
        List<String> parts = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder current = new StringBuilder();

        for (char c : command.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ' ' && !inQuotes) {
                if (current.length() > 0) {
                    parts.add(current.toString());
                    current.setLength(0);
                }
            } else {
                current.append(c);
            }
        }

        if (current.length() > 0) {
            parts.add(current.toString());
        }

        return parts;
    }
}

