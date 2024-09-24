package com.tbtr.ffing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

//@SpringBootApplication
@SpringBootApplication(exclude = SecurityAutoConfiguration.class) // SpringSecurity 무시
public class FfingApplication {

	public static void main(String[] args) {
		SpringApplication.run(FfingApplication.class, args);
	}

}
