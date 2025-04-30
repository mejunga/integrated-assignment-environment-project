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
            File source = new File(submission.getWorkingDirectory(), "main.c");
            File executable = new File(submission.getWorkingDirectory(), "main.c.out");

            boolean compiled = executionManager.compile(currentAssignmentProject.getConfiguration(), source);
            result.setCompilationSuccess(compiled);

            if (compiled) {
                boolean executed = executionManager.execute(currentAssignmentProject.getConfiguration(), executable, new String[]{});
                result.setExecutionSuccess(executed);

                if (executed) {
                    boolean correct = outputComparator.compareOutputs(
                        new File(currentAssignmentProject.getConfiguration().getExpectedOutputPath()),
                        new File(submission.getWorkingDirectory(), "output.txt")
                    );
                    result.outputCorrect = correct;
                }
            }

            currentAssignmentProject.getResults().add(result);
        }
    }

    public void showReports() {
        reportManager.generateReport(currentAssignmentProject.getResults());
    }
}
