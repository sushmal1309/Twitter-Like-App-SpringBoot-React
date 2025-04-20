package com.infy.twitter.tweet.service;

import java.util.List;

import com.infy.twitter.tweet.dto.TweetDTO;

public interface TweetService {
	
	public TweetDTO postTweet(TweetDTO tweetDTO,Long tweetId);	
	public List<TweetDTO> getTweetsByUserId(Long userId);
	public List<TweetDTO> getReTweetsByUserId(Long userId);
	public TweetDTO updateTweet(Long id, TweetDTO tweetDTO);
	public void deleteTweet(Long id) ;
	public void likeTweet(Long id);
	public void dislikeTweet(Long id);
	public int getAllLikesById(Long id);
	public List<TweetDTO> getAll(String type,Long tweetId);
	public List<TweetDTO> getTweetsByContainingText(String text);
	public TweetDTO getTweetByTweetId(Long tweetId);
	public List<TweetDTO> getTweetsByFollowersId(List<Long> followerIds);
}
