package com.example.appcore.utils;

public class Main {
    public static void main(String[] args) {
        try {
            ServerHandler.startServer(8080);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
