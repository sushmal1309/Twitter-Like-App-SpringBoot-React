package com.infy.twitter.follow.service;


import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.infy.twitter.follow.dto.FollowsDTO;
import com.infy.twitter.follow.dto.UserDTO;
import com.infy.twitter.follow.entity.Follows;
import com.infy.twitter.follow.exception.FollowException;
import com.infy.twitter.follow.repository.FollowRepository;

import jakarta.transaction.Transactional;

@Service("FollowService")
@Transactional
public class FollowServiceImpl implements FollowService{
	
	@Autowired
	private WebClient.Builder webClientBuilder;
	
	@Autowired
	private FollowRepository followRepository;
	

	private ModelMapper modelMapper = new ModelMapper();
	
	@Autowired
	private Environment env; 

	@Override
	public Follows follow(FollowsDTO followsDTO,String token) throws FollowException {
		
		UserDTO userDTO = webClientBuilder.build().get().uri("http://localhost:8085/user/"+followsDTO.getUserId())
				.header(HttpHeaders.AUTHORIZATION, token)
				.retrieve().bodyToMono(UserDTO.class).block();
		if(userDTO != null) {
			return followRepository.save(modelMapper.map(followsDTO, Follows.class));
		}
		else {
			throw new FollowException(env.getProperty("User.NotFound"));
		}
	}
	
	public List<Long> getFollowersByUserId(Long userId){
		
		return followRepository.findFollowersByUserId(userId);
		
	}

	@Override
	public List<Long> getFollowingsByUserId(Long userId) {
	
		return followRepository.findFollowingsByUserId(userId);
	}

	@Override
	public void unfollow(Long userId,Long followerId) {
		
		followRepository.deleteByUserIdAndFollowerId(userId, followerId);
		
	}

}
