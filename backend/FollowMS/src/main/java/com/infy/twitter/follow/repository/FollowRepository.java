package com.infy.twitter.follow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.infy.twitter.follow.entity.Follows;

public interface FollowRepository extends JpaRepository<Follows, Long> {
	
	@Query("select f.followerId from Follows f where f.userId = ?1")
	public List<Long> findFollowersByUserId(Long userId); 
	
	@Query("select f.userId from Follows f where f.followerId = ?1")
	public List<Long> findFollowingsByUserId(Long userId);
	
	public void deleteByUserIdAndFollowerId(Long userId,Long followerId);
}
