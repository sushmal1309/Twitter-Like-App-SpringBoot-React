package com.infy.twitter.search.service;

import java.util.List;

import com.infy.twitter.search.dto.BasicUserDTO;
import com.infy.twitter.search.dto.TweetDTO;

public interface SearchService {

	public List<BasicUserDTO> searchForUser(String name,String token);
	
	public List<TweetDTO> searchForTweets(String text,String token);

}
