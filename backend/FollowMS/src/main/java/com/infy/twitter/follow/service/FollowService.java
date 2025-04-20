package com.infy.twitter.follow.service;

import java.util.List;

import com.infy.twitter.follow.dto.FollowsDTO;
import com.infy.twitter.follow.entity.Follows;
import com.infy.twitter.follow.exception.FollowException;

public interface FollowService {
	
	public Follows follow(FollowsDTO followsDTO,String token) throws FollowException ;
	public List<Long> getFollowersByUserId(Long userId);
	public List<Long> getFollowingsByUserId(Long userId);
	public void unfollow(Long userId,Long followerId);
}
