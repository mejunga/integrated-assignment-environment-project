package com.example.appcore.utils;

import java.util.List;

public class ReportManager {
    public void generateReport(List<Result> results) {
        for (Result result : results) {
            System.out.println("Student ID: " + result.studentId);
            System.out.println("Compiled: " + result.compilationSuccess);
            System.out.println("Executed: " + result.executionSuccess);
            System.out.println("Correct Output: " + result.outputCorrect);
            System.out.println("----");
        }
    }
}
