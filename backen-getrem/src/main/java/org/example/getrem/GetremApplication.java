package org.example.getrem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GetremApplication {

    public static void main(String[] args) {
        SpringApplication.run(GetremApplication.class, args);
    }

}
