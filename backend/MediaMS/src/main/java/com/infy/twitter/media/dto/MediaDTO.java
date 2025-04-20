package com.infy.twitter.media.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MediaDTO {
	private Long mediaId;
	private Long userId;
	private Long tweetId;
	private String mediaUrl;
	private String mediaType;
	private LocalDateTime createdAt;
}
