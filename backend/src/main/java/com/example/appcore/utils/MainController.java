package com.example.appcore.utils;

import java.io.File;
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
        List<Submission> submissions = currentAssignmentProject.getSubmissions();

        for (Submission submission : submissions) {
            Result result = new Result(submission.getStudentId());

            File[] sourceFiles = submission.getWorkingDirectory().listFiles((dir, name) ->
                    name.endsWith(".java") || name.endsWith(".c") || name.endsWith(".cpp") || name.endsWith(".py"));

            if (sourceFiles == null || sourceFiles.length == 0) {
                System.out.println("No source file found for student: " + submission.getStudentId());
                continue;
            }

            File source = sourceFiles[0];
            System.out.println("Using source file: " + source.getAbsolutePath());

            boolean compiled = executionManager.compile(currentAssignmentProject.getConfiguration(), source);
            result.setCompilationSuccess(compiled);

            if (compiled) {
                boolean executed = executionManager.execute(currentAssignmentProject.getConfiguration(), source, new String[]{});
                result.setExecutionSuccess(executed);

                if (executed) {
                    File expected = new File(currentAssignmentProject.getConfiguration().getExpectedOutputPath());
                    File actual = new File(submission.getWorkingDirectory(), "output.txt");
                    boolean correct = outputComparator.compareOutputs(expected, actual);
                    result.outputCorrect = correct;
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
