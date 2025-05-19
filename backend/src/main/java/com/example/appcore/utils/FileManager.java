package com.example.appcore.utils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class FileManager {
    private final AssignmentProject project;
    private final ZipHandler zipHandler = new ZipHandler();

    public FileManager(AssignmentProject project) {
        this.project = project;
    }

    public void saveAssignmentProject(AssignmentProject project, File destination) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(destination))) {
            oos.writeObject(project);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public AssignmentProject loadAssignmentProject(File source) {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(source))) {
            return (AssignmentProject) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }

    //  extractSubmission method: extracts a single ZIP submission from a file path
    public void extractSubmission(File zipFile) {
        if (!zipFile.exists() || !zipFile.getName().endsWith(".zip")) {
            System.err.println("Invalid ZIP file: " + zipFile.getAbsolutePath());
            return;
        }

        try {
            String studentId = zipFile.getName().replace(".zip", "");
            File outputDir = new File(zipFile.getParentFile(), "temp/" + studentId);
            zipHandler.unzip(zipFile, outputDir);

            Submission submission = new Submission(studentId, outputDir);
            List<Submission> submissions = project.getSubmissions();
            if (submissions == null) {
                submissions = new ArrayList<>();
                project.setSubmissions(submissions);
            }
            submissions.add(submission);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
