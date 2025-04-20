package com.infy.twitter.search.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.infy.twitter.search.dto.BasicUserDTO;
import com.infy.twitter.search.dto.TweetDTO;


@Service("SearchService")
public class SearchServiceImpl implements SearchService {
	
	@Autowired
	private WebClient.Builder webClientBuilder;

	@Override
	public List<BasicUserDTO> searchForUser(String name,String token) {
		// TODO Auto-generated method stub
		return webClientBuilder.build().get().uri("http://UserMS/user/search?query="+name)
				.header(HttpHeaders.AUTHORIZATION, token)
				.retrieve().bodyToMono(List.class).block();
	}

	@Override
	public List<TweetDTO> searchForTweets(String text,String token) {
		// TODO Auto-generated method stub
		return webClientBuilder.build().get().uri("http://TweetMS/tweets/search?query="+text).header(HttpHeaders.AUTHORIZATION, token).retrieve().bodyToMono(List.class).block();
	}
	
}
