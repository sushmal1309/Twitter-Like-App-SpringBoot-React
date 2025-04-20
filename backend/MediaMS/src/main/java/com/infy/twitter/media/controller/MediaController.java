package com.infy.twitter.media.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infy.twitter.media.dto.MediaDTO;
import com.infy.twitter.media.service.MediaService;

@RestController
@RequestMapping("/media")
public class MediaController {
	
	@Autowired
	private MediaService mediaService;
	
	@PostMapping("/upload")
	public ResponseEntity<MediaDTO> createMedia(@RequestBody MediaDTO mediaDTO) {
		return new ResponseEntity<>(mediaService.createMedia(mediaDTO),HttpStatus.CREATED);
	}
	
	@GetMapping("/{tweetId}")
	public ResponseEntity<List<MediaDTO>> getByTweetId(@PathVariable Long tweetId){
		return new ResponseEntity<>(mediaService.getMediaByTweetId(tweetId),HttpStatus.OK);
	}
	
	@DeleteMapping("/delete/{mediaId}")
	public ResponseEntity<Void> deleteMedia(@PathVariable Long mediaId) {
		mediaService.deleteMedia(mediaId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<Void> deleteByTweetId(@RequestParam Long tweetId) {
		
		mediaService.deleteByTweetId(tweetId);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
}
