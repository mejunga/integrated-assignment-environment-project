import java.io.*;

public class Main {
    public static void main(String[] args) {
        try (PrintWriter writer = new PrintWriter("output.txt")) {
            writer.println("Hello, world!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
