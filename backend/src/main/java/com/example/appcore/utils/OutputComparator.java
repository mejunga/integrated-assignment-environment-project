package com.example.appcore.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

public class OutputComparator {
    public boolean compareOutputs(File expectedOutput, File actualOutput) {
        try {
            List<String> expectedLines = Files.readAllLines(expectedOutput.toPath());
            List<String> actualLines = Files.readAllLines(actualOutput.toPath());
            return expectedLines.equals(actualLines);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
