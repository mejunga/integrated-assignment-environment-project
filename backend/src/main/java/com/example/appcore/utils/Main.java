package com.example.appcore.utils;

public class Main {
    public static void main(String[] args) {
        try {
            ServerHandler.startServer(4040);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
