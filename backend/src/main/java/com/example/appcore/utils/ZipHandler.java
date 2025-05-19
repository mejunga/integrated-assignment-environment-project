package com.example.appcore.utils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.Gson;


//This class and its methods act as a bridge between the app and outside world

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

    public void appendResultToZip(File zipFile, Result result) throws IOException {
    File tempZip = new File(zipFile.getParent(), "temp_" + zipFile.getName());
    byte[] buffer = new byte[1024];
    Gson gson = new Gson();

    try (
        ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile));
        ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(tempZip))
    ) {
        ZipEntry entry;
        while ((entry = zis.getNextEntry()) != null) {
            zos.putNextEntry(new ZipEntry(entry.getName()));
            int len;
            while ((len = zis.read(buffer)) > 0) {
                zos.write(buffer, 0, len);
            }
            zos.closeEntry();
        }

        ZipEntry resultEntry = new ZipEntry("result.json");
        zos.putNextEntry(resultEntry);
        zos.write(gson.toJson(result).getBytes());
        zos.closeEntry();
    }

    Files.move(tempZip.toPath(), zipFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
}


    private String extractID(String filename) {
        return filename.replace(".zip", "");
    }

    void unzip(File zipFile, File outputDir) throws IOException {
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
