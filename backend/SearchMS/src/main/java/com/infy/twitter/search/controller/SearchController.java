package com.infy.twitter.search.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infy.twitter.search.dto.BasicUserDTO;
import com.infy.twitter.search.dto.TweetDTO;
import com.infy.twitter.search.service.SearchService;

@RestController
@RequestMapping("/search")

public class SearchController {
	
	@Autowired
	private SearchService searchService;
	
	@GetMapping("/user")
	public ResponseEntity<List<BasicUserDTO>> searchForUser(@RequestParam("query") String name,@RequestHeader(HttpHeaders.AUTHORIZATION) String token){		
		return new ResponseEntity<List<BasicUserDTO>>(searchService.searchForUser(name,token), HttpStatus.OK);
	}
	
	@GetMapping("/tweets")
	public ResponseEntity<List<TweetDTO>> searchForTweets(@RequestParam("query") String text,@RequestHeader(HttpHeaders.AUTHORIZATION) String token){
		return new ResponseEntity<>(searchService.searchForTweets(text,token),HttpStatus.OK);
	}
}
