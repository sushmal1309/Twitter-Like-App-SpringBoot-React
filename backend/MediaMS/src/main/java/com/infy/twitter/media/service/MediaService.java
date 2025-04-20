package com.infy.twitter.media.service;

import java.util.List;

import com.infy.twitter.media.dto.MediaDTO;

public interface MediaService {
	
	public MediaDTO createMedia(MediaDTO mediaDTO);

	public MediaDTO getMediaById(Long mediaIid);

	public List<MediaDTO> getMediaByTweetId(Long tweetId);

	public void deleteMedia(Long mediaId);
	
	public void deleteByTweetId(Long tweetId);
	
}
