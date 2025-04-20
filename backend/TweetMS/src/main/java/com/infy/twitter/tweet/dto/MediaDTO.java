package com.infy.twitter.tweet.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MediaDTO {
	private Long mediaId;
	private Long userId;
	private Long tweetId;
	private String mediaUrl;
	private String mediaType;
	private Boolean isDelete = false;
	private LocalDateTime createdAt;
}
