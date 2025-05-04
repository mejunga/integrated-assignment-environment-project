package com.example.appcore.utils;

import java.io.File;

public class Main {
    public static void main(String[] args) {
        /*Configuration config = new Configuration(
                "java",
                "javac {source}",
                "java -cp {dir} {class}",
                "expected_output/output.txt"
        );

        MainController controller = new MainController();
        controller.createNewAssignmentProject("java Sorting AssignmentProject", config);

        File zipFolder = new File("test_submissions");
        controller.importSubmissions(zipFolder);

        controller.processSubmissions();

        controller.showReports();

        // Ensure the directory exists before saving
        File saveDir = new File("saved_projects");
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }

        File saveFile = new File(saveDir, "c_project.ser");
        controller.saveAssignmentProject(saveFile);

        System.out.println("\nAssignmentProject processed and saved successfully.");
         */
        Configuration pythonConfig = new Configuration(
                "python",
                null, // Python doesn't require compilation
                "python {exec} {args}",
                "expected_output/output.txt"
        );

        MainController controller = new MainController();
        controller.createNewAssignmentProject("PythonAssignment", pythonConfig);
        File zip = new File("test_submissions");
        controller.importSubmissions(zip);
        controller.processSubmissions();
        controller.showReports();
        File saveDir = new File("saved_projects");
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }

        File saveFile = new File(saveDir, "c_project.ser");
        controller.saveAssignmentProject(saveFile);

        System.out.println("\nAssignmentProject processed and saved successfully.");
    }
}
