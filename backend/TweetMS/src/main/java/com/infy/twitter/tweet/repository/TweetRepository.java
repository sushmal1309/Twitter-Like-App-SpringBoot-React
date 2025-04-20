package com.infy.twitter.tweet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.infy.twitter.tweet.entity.Tweet;
import com.infy.twitter.tweet.entity.TweetType;

public interface TweetRepository extends JpaRepository<Tweet, Long>{
	
	public List<Tweet> findByUserIdAndType(Long userId,TweetType type);
	
	public List<Tweet> findTop5ByUserIdAndTypeOrderByCreatedAtDesc(Long userId,TweetType type);
		
	@Query("select t from Tweet t where t.type = ?1 and t.tweetId in (select t.tweetId from ReplyOrRetweet t where t.forTweetId=?2)")
	public List<Tweet> getAll(TweetType type,Long tweetId);
	
	public List<Tweet> findByTweetContentContainingIgnoreCase(String text);
	
	
}
