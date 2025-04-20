package com.infy.twitter.media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.infy.twitter.media.entity.Media;

public interface MediaRepository extends JpaRepository<Media, Long>{

	List<Media> findByTweetId(Long tweetId);
	
	void deleteByTweetId(Long tweetId);

}
