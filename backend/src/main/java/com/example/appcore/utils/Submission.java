package com.example.appcore.utils;

import java.io.File;

public class Submission {
    private String studentId;
    private File workingDirectory;

    public Submission(String studentId, File workingDirectory) {
        this.studentId = studentId;
        this.workingDirectory = workingDirectory;
    }

    public String getStudentId() {
        return studentId;
    }

    public File getWorkingDirectory() {
        return workingDirectory;
    }
}
