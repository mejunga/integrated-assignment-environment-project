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

    public String execute(Configuration config, File execFile, String[] args, File inputFile) {
        List<String> argList = new ArrayList<>();
        if (args != null) {
            for (String arg : args) argList.add(arg);
        }
        if (inputFile != null && inputFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(inputFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    for (String token : line.trim().split("\\s+")) {
                        if (!token.isEmpty()) argList.add(token);
                    }
                }
            } catch (IOException e) {
                System.err.println("Error reading inputFile: " + e.getMessage());
            }
        }
        String command = config.getRunCommand(execFile, argList.toArray(new String[0]));
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
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }

            process.waitFor();
            return output.toString();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return null;
        }
    }
}
