package com.example.appcore.utils;

import java.io.File;
import java.io.Serializable;

public class Configuration implements Serializable {
    private static final long serialVersionUID = 1L;

    private String compileCommand;
    private String runCommand;
    private String expectedOutputPath;

    public Configuration(String compileCommand, String runCommand, String expectedOutputPath) {
        this.compileCommand = compileCommand;
        this.runCommand = runCommand;
        this.expectedOutputPath = expectedOutputPath;
    }

    public String getCompileCommand(File source) {
        return compileCommand.replace("{source}", "\"" + source.getAbsolutePath() + "\"");
    }

    public String getRunCommand(File executable, String[] args) {
        String arguments = String.join(" ", args);
        String path = executable.getAbsolutePath();
        String dir = executable.getParent();
        String name = executable.getName().replace(".class", "");

        return runCommand
                .replace("{exec}", "\"" + path + "\"")
                .replace("{dir}", "\"" + dir + "\"")
                .replace("{class}", name)
                .replace("{source}", "\"" + path + "\"")  // 🟢 Add this!
                + " " + arguments;
    }


    public String getExpectedOutputPath() {
        return expectedOutputPath;
    }
}
