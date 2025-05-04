package com.example.appcore.utils;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.nio.file.Files;
import java.util.List;

public class Result implements Serializable {
    private static final long serialVersionUID = 1L;

    public String studentId;
    public boolean compilationSuccess;
    public boolean executionSuccess;
    public boolean outputCorrect;
    public String logs;

    public Result(String studentId) {
        this.studentId = studentId;
    }

    public boolean compareOutputs(File expected, File actual) throws IOException {
        if (!expected.exists() || !actual.exists()) {
            this.outputCorrect = false;
            return false;
        }
        List<String> expectedLines = Files.readAllLines(expected.toPath());
        List<String> actualLines = Files.readAllLines(actual.toPath());
        this.outputCorrect = expectedLines.equals(actualLines);
        return outputCorrect;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setCompilationSuccess(boolean success) {
        this.compilationSuccess = success;
    }

    public void setExecutionSuccess(boolean success) {
        this.executionSuccess = success;
    }

    public void setLogs(String logs) {
        this.logs = logs;
    }
    public void setOutputCorrect(boolean outputCorrect) {
        this.outputCorrect = outputCorrect;
    }
}
