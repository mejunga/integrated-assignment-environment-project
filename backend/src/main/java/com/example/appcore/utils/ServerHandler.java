package com.example.appcore.utils;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.google.gson.Gson;
import com.example.appcore.utils.AssignmentPayload;
import com.example.appcore.utils.Result;
import com.example.appcore.utils.Configuration;

public class ServerHandler {

    private static HttpServer server;

    public static void startServer(int port) throws IOException {
        if (server != null) {
            System.out.println("Server already running.");
            return;
        }

        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/process-assignment", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                System.out.println("1");
                if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                    System.out.println("2");
                    exchange.sendResponseHeaders(405, -1);
                    return;
                }

                // Read JSON payload from frontend
                System.out.println("3");
                String requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                Gson gson = new Gson();
                AssignmentPayload assignment = gson.fromJson(requestBody, AssignmentPayload.class);
                System.out.println("4");

                // Build Configuration
                String compileCommand = (assignment.config.compile != null)
                        ? assignment.config.compile.command + " " + String.join(" ", assignment.config.compile.args)
                        : null;
                String runCommand = assignment.config.run.command + " " + String.join(" ", assignment.config.run.args);
                System.out.println("5");

                Configuration config = new Configuration(
                        assignment.config.language,
                        compileCommand,
                        runCommand,
                        assignment.expectedOutputFile
                );
                System.out.println("6");

                // Process submissions
                MainController controller = new MainController();
                controller.createNewAssignmentProject(assignment.title, config, assignment.inputFile);
                controller.importSubmissionsFromPaths(assignment.path);
                controller.processSubmissions();

                // Inject result.json into each ZIP
                ZipHandler zipHandler = new ZipHandler();
                List<Result> results = controller.getResults();
                //System.out.println(results.toString());

                for (Result result : results) {
                    String studentId = result.getStudentId();
                    //System.out.println(studentId);
                    for (String zipPath : assignment.path) {
                        File zipFile = new File(zipPath);
                        //System.out.println(zipFile.getAbsolutePath());
                        if (zipFile.getName().contains(studentId)) {
                            if (zipFile.exists()) {
                                zipHandler.appendResultToZip(zipFile, result);
                            }
                        }
                    }
                }

                System.out.println(assignment.path[0]);

                // Respond to frontend
                String jsonResponse = new Gson().toJson(true);
                byte[] responseBytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, responseBytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(responseBytes);
                }
            }
        });

        server.start();
        System.out.println("Server started on port " + port);
    }

    public static void stopServer() {
        if (server != null) {
            server.stop(0);
            server = null;
            System.out.println("Server stopped.");
        }
    }
}