package com.example.appcore.utils;

import java.io.File;

public class Main {
    public static void main(String[] args) {
        Configuration config = new Configuration(
                "java",
                "javac {exec}",
                "java -cp {workingDir} {execName}",
                "expected_output/output.txt"
        );

        MainController controller = new MainController();
        controller.createNewAssignmentProject("JavaAssignment", config);

        File zipFolder = new File("test_submissions");
        controller.importSubmissions(zipFolder);

        controller.processSubmissions();
        controller.showReports();

        File saveDir = new File("saved_projects");
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }
        File saveFile = new File(saveDir, "java_project.ser");
        controller.saveAssignmentProject(saveFile);

        System.out.println("\nJava AssignmentProject processed and saved successfully.");
    }


        /*// === PYTHON CONFIGURATION ===
        Configuration config = new Configuration(
                "python",             // language
                null,                 // no compile step
                "python {exec}",      // DROP the "{args}" placeholder so there’s no trailing empty argument
                "expected_output/output.txt"
        );

        MainController controller = new MainController();
        controller.createNewAssignmentProject("PythonAssignment", config);

        File zipFolder = new File("test_submissions");
        controller.importSubmissions(zipFolder);

        controller.processSubmissions();
        controller.showReports();

        // Persist the project if you like
        File saveDir = new File("saved_projects");
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }
        File saveFile = new File(saveDir, "py_project.ser");
        controller.saveAssignmentProject(saveFile);

        System.out.println("\nPython AssignmentProject processed and saved successfully.");
    }*/
}
