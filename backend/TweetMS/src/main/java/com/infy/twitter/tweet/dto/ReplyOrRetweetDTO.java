package com.infy.twitter.tweet.dto;

import lombok.Data;

@Data
public class ReplyOrRetweetDTO {
	
	private Long replyId;
	private TweetDTO tweetDTO;
}
