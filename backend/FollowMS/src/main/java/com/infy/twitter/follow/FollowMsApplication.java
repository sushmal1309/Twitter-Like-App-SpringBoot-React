package com.infy.twitter.follow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class FollowMsApplication {

	public static void main(String[] args) {

		SpringApplication.run(FollowMsApplication.class, args);
	}
	
	@Bean
	public WebClient.Builder webClientBuilder(){
		return WebClient.builder();
	}

}
