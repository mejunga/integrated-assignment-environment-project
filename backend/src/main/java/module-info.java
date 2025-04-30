module com.example.appcore {
    requires java.base; 
    requires java.net.http;  
    requires jdk.httpserver;

    exports com.example.appcore.utils;
}