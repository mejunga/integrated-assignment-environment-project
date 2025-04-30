package com.example.appcore.utils;

import java.io.File;

public class Configuration {
    private String compileCommand;
    private String runCommand;
    private String expectedOutputPath;

    public Configuration(String compileCommand, String runCommand, String expectedOutputPath) {
        this.compileCommand = compileCommand;
        this.runCommand = runCommand;
        this.expectedOutputPath = expectedOutputPath;
    }

    public String getCompileCommand(File source) {
        return compileCommand.replace("{source}", source.getPath());
    }

    public String getRunCommand(File executable, String[] args) {
        String arguments = String.join(" ", args);
        return runCommand.replace("{exec}", executable.getPath()) + " " + arguments;
    }

    public String getExpectedOutputPath() {
        return expectedOutputPath;
    }
}
