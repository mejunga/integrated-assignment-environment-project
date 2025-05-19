package com.example.appcore.utils;

import java.io.File;

public class AssignmentPayload {
    public String title;
    public ConfigPayload config;
    public File inputFile;
    public String expectedOutputFile;
    public String[] compareOptions;
    public String[] path;
}

class ConfigPayload {
    public String name;
    public String language;
    public CompileConfig compile;
    public RunConfig run;
    public boolean interpreted;
}

class CompileConfig {
    public String command;
    public String[] args;
}

class RunConfig {
    public String command;
    public String[] args;
}
