package com.infy.twitter.tweet.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.infy.twitter.tweet.entity.ReplyOrRetweet;

public interface ReplyOrRetweetReposiory extends JpaRepository<ReplyOrRetweet, Long>{
	
	public List<ReplyOrRetweet> findByForTweetId(Long tweetId);
}
