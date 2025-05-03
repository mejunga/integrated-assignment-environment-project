package com.example.appcore.utils;

import java.io.File;

public class Main {
    public static void main(String[] args) {
        System.out.println("Received " + args.length + " args");
        for (int i = 0; i < args.length; i++) {
            System.out.println("Arg " + i + ": " + args[i]);
        }

        if (args.length != 5) {
            System.out.println("Usage: <ProjectName> <CompileCommand> <RunCommand> <ExpectedOutputPath> <SubmissionsFolder>");
            return;
        }

        String projectName = args[0];
        String compileCommand = args[1];
        String runCommand = args[2];
        String expectedOutput = args[3];
        String submissionsPath = args[4];

        Configuration config = new Configuration(compileCommand, runCommand, expectedOutput);
        MainController controller = new MainController();
        controller.createNewAssignmentProject(projectName, config);

        File zipFolder = new File(submissionsPath);
        controller.importSubmissions(zipFolder);
        controller.processSubmissions();
        controller.showReports();

        File saveDir = new File("saved_projects");
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }

        File saveFile = new File(saveDir, projectName + ".ser");
        controller.saveAssignmentProject(saveFile);

        System.out.println("\nAssignmentProject processed and saved successfully.");
        controller.loadAssignmentProject(new File("saved_projects/MyProject.ser"));
        controller.showReports();

    }
}
