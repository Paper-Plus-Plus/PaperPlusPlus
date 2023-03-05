package src.Backend;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.*;
import java.util.Scanner;

public class CompileCode {

    private String name; // name of the class to be compile

    public CompileCode(String name) {
        this.name = name;
    }

    private void start() {
        try {
            Class<?> c = Class.forName("src.Backend." + name);
            Method m = c.getDeclaredMethod("main", String[].class);
            m.invoke(null, (Object) new String[] {});
        } catch (Exception e) {
            System.out.println(false + "\n" + e.getCause());
        }
    }

    public static void main(String[] args) {
        CompileCode c = new CompileCode(file);
        c.start();
    }
}