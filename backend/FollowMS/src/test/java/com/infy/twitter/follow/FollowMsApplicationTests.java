package com.infy.twitter.follow;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

import com.infy.twitter.follow.dto.FollowsDTO;
import com.infy.twitter.follow.dto.UserDTO;
import com.infy.twitter.follow.entity.Follows;
import com.infy.twitter.follow.exception.FollowException;
import com.infy.twitter.follow.repository.FollowRepository;
import com.infy.twitter.follow.service.FollowService;
import com.infy.twitter.follow.service.FollowServiceImpl;

import reactor.core.publisher.Mono;

@SpringBootTest
class FollowMsApplicationTests {
	
	
	@Mock
	private FollowRepository followRepository;
	
	@Mock
	private ModelMapper modelMapper;
	
	@Mock
	private Environment env;
	
	@Mock
	private WebClient.Builder webClientBuilder;
	
	@Mock
	private WebClient webClient;
	
	@Mock
	private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;
	
	@Mock
	private WebClient.RequestHeadersSpec requestHeadersSpec;
	
	@Mock
	private WebClient.ResponseSpec responseSpec;
	
	@InjectMocks
	private FollowService followService = new FollowServiceImpl();
	
	@BeforeEach
	void setUp() {
		Mockito.when(webClientBuilder.baseUrl(Mockito.anyString())).thenReturn(webClientBuilder);
		Mockito.when(webClientBuilder.build()).thenReturn(webClient);
	}
	
	@Test
	void noFollowersTest() {
		
		List<Long> followersList = new ArrayList<>();
		Long userId = 2L;
		
		Mockito.when(followRepository.findFollowersByUserId(userId)).thenReturn(followersList);
		assertEquals(0,followService.getFollowersByUserId(userId).size());		
		
	}
	
	@Test
	void noFollowingsTest() {
		
		List<Long> followingsList = new ArrayList<>();
		Long userId = 2L;
		
		Mockito.when(followRepository.findFollowingsByUserId(userId)).thenReturn(followingsList);
		assertEquals(followService.getFollowingsByUserId(userId).size(),0);		
		
	}
	@Test
	void unfollowTest() {
		Long userId = 1L;
		Long followerId = 2L;
		Mockito.doNothing().when(followRepository).deleteByUserIdAndFollowerId(userId, followerId);
		
		followService.unfollow(userId, followerId);
	}
	
	@Test
	void followValidTest() throws FollowException  {
		FollowsDTO followsDTO = new FollowsDTO();
		followsDTO.setUserId(1L);
		followsDTO.setFollowerId(2L);
		
		Follows follows = new Follows();
		follows.setUserId(1L);
		follows.setFollowerId(2L);
		
		Follows followsSaved = new Follows();
		followsSaved.setUserId(1L);
		followsSaved.setUserId(1L);
		followsSaved.setFollowerId(2L);
		
		UserDTO userDTO = new UserDTO();
		userDTO.setUserId(1L);
		
		Mockito.when(webClient.get()).thenReturn(requestHeadersUriSpec);
		Mockito.when(requestHeadersUriSpec.uri("http://localhost:8085/user/"+followsDTO.getUserId())).thenReturn(requestHeadersSpec);
		Mockito.when(requestHeadersSpec.header(HttpHeaders.AUTHORIZATION, "jwttoken")).thenReturn(requestHeadersSpec);
		Mockito.when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		Mockito.when(responseSpec.bodyToMono(UserDTO.class)).thenReturn(Mono.just(userDTO));

		Mockito.when(modelMapper.map(followsDTO, Follows.class)).thenReturn(follows);
		Mockito.when(followRepository.save(follows)).thenReturn(followsSaved);
		
		Follows actual = followService.follow(followsDTO,"jwttoken");
		Assertions.assertEquals(followsSaved, actual);
		
	}
	
	@Test
	void followInValidTest() throws FollowException {
		FollowsDTO followsDTO = new FollowsDTO();
		followsDTO.setUserId(1L);
		followsDTO.setFollowerId(2L);
		
		Follows follows = new Follows();
		follows.setUserId(1L);
		follows.setFollowerId(2L);	
		
		Mockito.when(webClient.get()).thenReturn(requestHeadersUriSpec);
		Mockito.when(requestHeadersUriSpec.uri("http://localhost:8085/user/"+followsDTO.getUserId())).thenReturn(requestHeadersSpec);
		Mockito.when(requestHeadersSpec.header(HttpHeaders.AUTHORIZATION, "jwttoken")).thenReturn(requestHeadersSpec);
		Mockito.when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		Mockito.when(responseSpec.bodyToMono(UserDTO.class)).thenReturn(Mono.empty());

		Assertions.assertThrows(FollowException.class, ()->followService.follow(followsDTO,"jwttoken"));
		
	}
	
	
	
	
}
