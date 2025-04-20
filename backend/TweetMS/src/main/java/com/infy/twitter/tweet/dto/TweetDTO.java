package com.infy.twitter.tweet.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.infy.twitter.tweet.entity.TweetType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TweetDTO {
	
	private Long tweetId;
	@NotNull(message = "{userid.null}")
	private Long userId;	
	@NotNull(message = "{tweet.content}")
	@Pattern(regexp = ".+{1,280}", message = "{tweet.content.length}")
	private String tweetContent;	
	private int likes;
	private TweetType type;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<MediaDTO> media;
}
