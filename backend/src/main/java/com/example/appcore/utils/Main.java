package com.example.appcore.utils;

import java.io.File;

public class Main {
    public static void main(String[] args) {
        Configuration config = new Configuration(
            "gcc {source} -o {source}.out",
            "{exec}",
            "expected_output/output.txt"
        );

        MainController controller = new MainController();
        controller.createNewAssignmentProject("C Sorting AssignmentProject", config);

        File zipFolder = new File("test_submissions");
        controller.importSubmissions(zipFolder);

        controller.processSubmissions();

        controller.showReports();

        File saveFile = new File("saved_projects/c_project.ser");
        controller.saveAssignmentProject(saveFile);

        System.out.println("\nAssignmentProject processed and saved successfully.");
    }
}
