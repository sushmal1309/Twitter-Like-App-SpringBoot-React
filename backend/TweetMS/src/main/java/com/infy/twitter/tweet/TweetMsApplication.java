package com.infy.twitter.tweet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;


@SpringBootApplication
public class TweetMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(TweetMsApplication.class, args);
	}
	
	@Bean
	public WebClient.Builder webClientBuilder(){
		return WebClient.builder();
	}

}
