package com.example.appcore.utils;

import java.io.*;
import java.util.List;

public class MainController {
    private AssignmentProject currentAssignmentProject;
    private final ZipHandler zipHandler = new ZipHandler();
    private final ExecutionManager executionManager = new ExecutionManager();
    private final OutputComparator outputComparator = new OutputComparator();
    private final ReportManager reportManager = new ReportManager();

    public void createNewAssignmentProject(String projectName, Configuration config) {
        currentAssignmentProject = new AssignmentProject(projectName, config);
    }

    public void loadAssignmentProject(File file) {
        FileManager fileManager = new FileManager(currentAssignmentProject);
        currentAssignmentProject = fileManager.loadAssignmentProject(file);
    }

    public void saveAssignmentProject(File file) {
        FileManager fileManager = new FileManager(currentAssignmentProject);
        fileManager.saveAssignmentProject(currentAssignmentProject, file);
    }

    public void importSubmissions(File zipDirectory) {
        List<Submission> submissions = zipHandler.extractAll(zipDirectory);
        currentAssignmentProject.setSubmissions(submissions);
    }

    // ✅ NEW METHOD: Import using file paths from frontend
    public void importSubmissionsFromPaths(String[] zipPaths) {
        FileManager fileManager = new FileManager(currentAssignmentProject);
        for (String path : zipPaths) {
            File zipFile = new File(path);
            if (zipFile.exists() && zipFile.getName().endsWith(".zip")) {
                fileManager.extractSubmission(zipFile);
            } else {
                System.err.println("Invalid ZIP path: " + path);
            }
        }
    }

    public void processSubmissions() {
        if (currentAssignmentProject == null) {
            System.err.println("No project loaded.");
            return;
        }

        List<Submission> submissions = currentAssignmentProject.getSubmissions();
        Configuration config = currentAssignmentProject.getConfiguration();

        String language = config.getLanguage().toLowerCase();
        String extension = language.equals("python") ? ".py" : language.equals("c") ? ".c" : ".java";

        for (Submission submission : submissions) {
            Result result = new Result(submission.getStudentId());

            File sourceFile = findSourceFile(submission.getWorkingDirectory(), extension);
            if (sourceFile == null) {
                System.out.println("No " + extension + " file found for student: " + submission.getStudentId());
                continue;
            }

            File workingDir = submission.getWorkingDirectory();
            File compileTarget = language.equals("c") ? new File(workingDir, "a.out") : null;

            boolean compiled = executionManager.compile(config, sourceFile, compileTarget);
            result.setCompilationSuccess(compiled);

            if (compiled) {
                File executable = language.equals("c") ? compileTarget : sourceFile;

                String output = executionManager.execute(config, executable, new String[]{});
                boolean executed = output != null;
                result.setExecutionSuccess(executed);

                if (executed) {
                    File actualOutputFile = new File(workingDir, "output.txt");
                    try (BufferedWriter writer = new BufferedWriter(new FileWriter(actualOutputFile))) {
                        writer.write(output);
                    } catch (IOException e) {
                        System.err.println("Error writing output.txt for student " + submission.getStudentId());
                        e.printStackTrace();
                        result.setOutputCorrect(false);
                        currentAssignmentProject.getResults().add(result);
                        continue;
                    }

                    File expectedOutputFile = new File(config.getExpectedOutputPath());
                    boolean correct = outputComparator.compareOutputs(expectedOutputFile, actualOutputFile);
                    result.setOutputCorrect(correct);
                }
            }

            currentAssignmentProject.getResults().add(result);
        }
    }

    public void showReports() {
        System.out.println("Processing " + currentAssignmentProject.getSubmissions().size() + " submissions.");
        reportManager.generateReport(currentAssignmentProject.getResults());
    }

    private File findSourceFile(File dir, String extension) {
        File[] entries = dir.listFiles();
        if (entries == null) return null;

        for (File f : entries) {
            if (f.isDirectory()) {
                File found = findSourceFile(f, extension);
                if (found != null) return found;
            } else if (f.getName().toLowerCase().endsWith(extension)) {
                return f;
            }
        }
        return null;
    }

    public List<Result> getResults() {
        return currentAssignmentProject.getResults();
    }
}
