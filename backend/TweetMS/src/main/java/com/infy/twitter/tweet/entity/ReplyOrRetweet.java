package com.infy.twitter.tweet.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ReplyOrRetweet {
	
	@Id
	private Long tweetId;
	private Long forTweetId;
}
