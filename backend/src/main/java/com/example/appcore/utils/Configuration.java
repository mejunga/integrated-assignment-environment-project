package com.example.appcore.utils;

import java.io.File;
import java.io.Serializable;

public class Configuration implements Serializable {
    private static final long serialVersionUID = 1L;

    private final String language;
    private final String compileCommand;
    private final String runCommand;
    private final String expectedOutputPath;

    public Configuration(String language, String compileCommand, String runCommand, String expectedOutputPath) {
        this.language = language;
        this.compileCommand = compileCommand;
        this.runCommand = runCommand;
        this.expectedOutputPath = expectedOutputPath;
    }
    

    public String getCompileCommand(File sourceFile, File outputExecutable) {
        if (compileCommand == null) return null;

        String cmd = compileCommand.replace("{exec}", sourceFile.getAbsolutePath());
        if (outputExecutable != null) {
            cmd = cmd.replace("{out}", outputExecutable.getPath());
        }
        return cmd;
    }

    public String getRunCommand(File execFile, String[] args) {
        String joinedArgs = String.join(" ", args);
        return runCommand
                .replace("{exec}", execFile.getAbsolutePath())
                .replace("{execName}", getExecutableName(execFile))
                .replace("{workingDir}", new File(execFile.getParent()).getAbsolutePath())
                .replace("{args}", joinedArgs);
    }

    public String getExpectedOutputPath() {
        return expectedOutputPath;
    }

    public String getLanguage() {
        return language;
    }

    private String getExecutableName(File file) {
        String name = file.getName();
        int dot = name.lastIndexOf('.');
        return dot > 0 ? name.substring(0, dot) : name;
    }
}
