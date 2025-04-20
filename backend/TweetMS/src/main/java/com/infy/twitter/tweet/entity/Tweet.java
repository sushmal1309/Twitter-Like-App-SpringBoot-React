package com.infy.twitter.tweet.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tweets")
@Data
@NoArgsConstructor
public class Tweet {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long tweetId;
	private Long userId;	
	private String tweetContent;	
	private int likes;
	@Enumerated(EnumType.STRING)
	private TweetType type;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
