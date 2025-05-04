package com.example.appcore.utils;

import java.io.File;
import java.io.Serializable;

public class Configuration implements Serializable {
    private static final long serialVersionUID = 1L;
    private String language;
    private String compileCommand;
    private String runCommand;
    private String expectedOutputPath;

    public Configuration(String language, String compileCommand, String runCommand, String expectedOutputPath) {
        this.language=language;
        this.compileCommand = compileCommand;
        this.runCommand = runCommand;
        this.expectedOutputPath = expectedOutputPath;
    }

    public String getCompileCommand(File sourceFile, File outputExecutable) {
        if (compileCommand == null || compileCommand.isEmpty()) return null;
        return compileCommand
                .replace("{source}", sourceFile.getPath())
                .replace("{exec}", outputExecutable.getPath());
    }

    public String getRunCommand(File executableFile, String[] args) {
        String joinedArgs = String.join(" ", args);
        return runCommand
                .replace("{exec}", executableFile.getPath())
                .replace("{args}", joinedArgs);
    }

    public String getExpectedOutputPath() {
        return expectedOutputPath;
    }

    public String getLanguage() {
        return language;
    }
}
