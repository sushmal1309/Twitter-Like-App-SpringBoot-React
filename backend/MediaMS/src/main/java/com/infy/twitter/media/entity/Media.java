package com.infy.twitter.media.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Media {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long mediaId;
	private Long userId;
	private Long tweetId;
	
	private String mediaUrl;
	private String mediaType;
	private LocalDateTime createdAt;
}
