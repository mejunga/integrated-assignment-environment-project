package com.example.appcore.utils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class AssignmentProject implements Serializable {
    private String projectName;
    private Configuration configuration;
    private List<Submission> submissions = new ArrayList<>();
    private List<Result> results = new ArrayList<>();

    public AssignmentProject(String projectName, Configuration configuration) {
        this.projectName = projectName;
        this.configuration = configuration;
    }

    public String getAssignmentProjectName() {
        return projectName;
    }

    public Configuration getConfiguration() {
        return configuration;
    }

    public List<Submission> getSubmissions() {
        return submissions;
    }

    public void setSubmissions(List<Submission> submissions) {
        this.submissions = submissions;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }
}
