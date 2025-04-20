package com.infy.twitter.search.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class TweetDTO {
	
	private Long tweetId;
	private Long userId;	
	private String tweetContent;	
	private int likes;
	private String type;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<MediaDTO> media;
}
