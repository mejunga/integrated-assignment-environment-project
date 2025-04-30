package com.example.appcore.utils;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.ArrayList;
import java.util.List;

public class ZipHandler {
    public List<Submission> extractAll(File zipDirectory) {
        List<Submission> submissions = new ArrayList<>();
        File[] zipFiles = zipDirectory.listFiles((dir, name) -> name.endsWith(".zip"));
        if (zipFiles == null) return submissions;

        for (File zipFile : zipFiles) {
            try {
                String studentId = extractID(zipFile.getName());
                File outputDir = new File(zipDirectory.getParent(), "submissions/" + studentId);
                unzip(zipFile, outputDir);
                submissions.add(new Submission(studentId, outputDir));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return submissions;
    }

    private String extractID(String filename) {
        return filename.replace(".zip", "");
    }

    private void unzip(File zipFile, File outputDir) throws IOException {
        if (!outputDir.exists()) outputDir.mkdirs();
        byte[] buffer = new byte[1024];

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                File newFile = new File(outputDir, zipEntry.getName());
                if (zipEntry.isDirectory()) {
                    newFile.mkdirs();
                } else {
                    new File(newFile.getParent()).mkdirs();
                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zipEntry = zis.getNextEntry();
            }
        }
    }
}
