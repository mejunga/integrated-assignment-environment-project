package com.example.appcore.utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

public class MainController {
    private AssignmentProject currentAssignmentProject;
    private final ZipHandler zipHandler = new ZipHandler();
    private final ExecutionManager executionManager = new ExecutionManager();
    private final OutputComparator outputComparator = new OutputComparator();
    private final ReportManager reportManager = new ReportManager();
    private final FileManager fileManager = new FileManager();

    public void createNewAssignmentProject(String projectName, Configuration config) {
        currentAssignmentProject = new AssignmentProject(projectName, config);
    }

    public void loadAssignmentProject(File file) {
        currentAssignmentProject = fileManager.loadAssignmentProject(file);
    }

    public void saveAssignmentProject(File file) {
        fileManager.saveAssignmentProject(currentAssignmentProject, file);
    }

    public void importSubmissions(File zipDirectory) {
        List<Submission> submissions = zipHandler.extractAll(zipDirectory);
        currentAssignmentProject.setSubmissions(submissions);
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

            File[] sourceFiles = submission.getWorkingDirectory().listFiles((dir, name) -> name.endsWith(extension));
            if (sourceFiles == null || sourceFiles.length == 0) {
                System.out.println("No " + extension + " file found for student: " + submission.getStudentId());
                continue;
            }

            File source = sourceFiles[0];
            File workingDir = submission.getWorkingDirectory();

            boolean compiled = executionManager.compile(config, source, new File(workingDir, "a.out")); // For C, provide output binary
            result.setCompilationSuccess(compiled);

            if (compiled) {
                File executableFile = language.equals("java") || language.equals("python") ? source : new File(workingDir, "a.out");
                String output = executionManager.execute(config, executableFile, new String[]{});
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
        System.out.println("Processing " + currentAssignmentProject.getSubmissions().size() + " submissions...");
        reportManager.generateReport(currentAssignmentProject.getResults());
    }
}
