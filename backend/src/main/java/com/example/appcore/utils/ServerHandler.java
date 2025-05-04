package com.example.appcore.utils;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class ServerHandler {
    private static HttpServer server;

    public static void startServer(int port) throws IOException {
        if (server != null) {
            System.out.println("Server already running.");
            return;
        }

        server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/config", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if ("POST".equals(exchange.getRequestMethod())) {
                    InputStream is = exchange.getRequestBody();
                    String body = new String(is.readAllBytes());

                    System.out.println("Received POST data: " + body);

                    exchange.sendResponseHeaders(200, body.length());
                    OutputStream os = exchange.getResponseBody();
                    os.write(body.getBytes());
                    os.close();
                } else {
                    exchange.sendResponseHeaders(405, -1);
                }
            }
        });

        server.start();
        System.out.println("Server listening on port " + port + "...");
    }

    public static void stopServer() {
        if (server != null) {
            server.stop(0);
            server = null;
            System.out.println("Server stopped.");
        }
    }
}