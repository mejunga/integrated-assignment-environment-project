package com.example.appcore.utils;

import java.io.File;
import java.io.Serializable;

public class Submission implements Serializable {
    private static final long serialVersionUID = 1L;

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
