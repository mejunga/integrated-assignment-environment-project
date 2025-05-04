package com.example.appcore.utils;

import java.io.*;

public class FileManager {
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
}
