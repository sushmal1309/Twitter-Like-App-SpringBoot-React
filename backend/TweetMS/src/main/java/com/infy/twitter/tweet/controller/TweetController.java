package com.infy.twitter.tweet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infy.twitter.tweet.dto.TweetDTO;
import com.infy.twitter.tweet.service.TweetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tweets")
@Validated
public class TweetController {
		
    @Autowired
    private TweetService tweetService;

    @PostMapping("/create")
    public ResponseEntity<TweetDTO> createTweet(@RequestBody @Valid TweetDTO tweetDTO, @RequestParam(defaultValue = "0") Long tweetId) {
        return new ResponseEntity<TweetDTO>(tweetService.postTweet(tweetDTO,tweetId),HttpStatus.OK);
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<TweetDTO>> getTweetsByUserId(@PathVariable Long userId){
    	return new ResponseEntity<>(tweetService.getTweetsByUserId(userId),HttpStatus.OK);
    }
    @GetMapping("/retweet/{userId}")
    public ResponseEntity<List<TweetDTO>> getReTweetsByUserId(@PathVariable Long userId){
    	return new ResponseEntity<>(tweetService.getReTweetsByUserId(userId),HttpStatus.OK);
    }
    
    @PutMapping("/update/{tweetId}")
	public ResponseEntity<TweetDTO> updateTweet(@PathVariable Long tweetId,@RequestBody @Valid TweetDTO tweetDTO) {
    	return new ResponseEntity<TweetDTO>(tweetService.updateTweet(tweetId, tweetDTO),HttpStatus.OK);
	}
    
    @DeleteMapping("/delete/{tweetId}")
	public ResponseEntity<Long> deleteTweet(@PathVariable Long tweetId) {
		tweetService.deleteTweet(tweetId);
		return new ResponseEntity<Long>(tweetId,HttpStatus.OK);
	}
    
    @PutMapping("/like/{tweetId}")
	public ResponseEntity<Integer> likeTweet(@PathVariable Long tweetId) {
		tweetService.likeTweet(tweetId);
		return new ResponseEntity<>(tweetService.getAllLikesById(tweetId), HttpStatus.OK);
	}
    
    @PutMapping("/dislike/{tweetId}")
	public ResponseEntity<Integer> unlikeTweet(@PathVariable Long tweetId) {
		tweetService.dislikeTweet(tweetId);
		return new ResponseEntity<>(tweetService.getAllLikesById(tweetId), HttpStatus.OK);
	}
    
    @GetMapping("/{type}/{tweetId}")
    public ResponseEntity<List<TweetDTO>> getAllRepliesOrRetweets(@PathVariable String type, @PathVariable Long tweetId) {    	
		return new ResponseEntity<List<TweetDTO>>(tweetService.getAll(type,tweetId), HttpStatus.OK);    	
    }    
    
    @GetMapping("/search")
    public ResponseEntity<List<TweetDTO>> getTweetsByContainingText(@RequestParam("query") String text){
    	return new ResponseEntity<>(tweetService.getTweetsByContainingText(text), HttpStatus.OK);
    }
	
    @GetMapping("/tweet/{tweetId}")
    public ResponseEntity<TweetDTO> getTweetByTweetId(@PathVariable Long tweetId){
    	return new ResponseEntity<>(tweetService.getTweetByTweetId(tweetId),HttpStatus.OK);
    }
    
    @PostMapping("/followersTweet")
    public ResponseEntity<List<TweetDTO>> getTweetsByFollowersId(@RequestBody List<Long> followerIds) {
    	return new ResponseEntity<>(tweetService.getTweetsByFollowersId(followerIds),HttpStatus.OK);
    }
}
