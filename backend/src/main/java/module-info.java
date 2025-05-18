module com.example.appcore {
    requires java.base; 
    requires java.net.http;  
    requires jdk.httpserver;
    requires com.google.gson;

    exports com.example.appcore.utils;
}