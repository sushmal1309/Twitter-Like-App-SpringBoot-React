package com.infy.twitter.follow.controller;

import java.util.List;

import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infy.twitter.follow.dto.FollowsDTO;
import com.infy.twitter.follow.exception.FollowException;
import com.infy.twitter.follow.service.FollowService;

@RestController
@RequestMapping("/follows")
public class FollowController {
	
	@Autowired
	private FollowService followService;
	
	@PostMapping("/add")
	public void follow(@RequestBody FollowsDTO followsDTO,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) throws FollowException {
		followService.follow(followsDTO,token);
	}
	
	@GetMapping("/followers/{userId}")
	public List<Long> getFollowersByUserId(@PathVariable Long userId){
		return followService.getFollowersByUserId(userId);
	}
	
	@GetMapping("/followings/{userId}")
	public List<Long> getFollowingsByUserId(@PathVariable Long userId){
		return followService.getFollowingsByUserId(userId);
	}
	
	@DeleteMapping("/unfollow")
	public void unfollow(@RequestParam Long userId, @RequestParam Long followerId) {
		followService.unfollow(userId,followerId);
	}
}
