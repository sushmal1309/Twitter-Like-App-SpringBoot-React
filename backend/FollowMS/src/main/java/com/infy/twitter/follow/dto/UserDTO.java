package com.infy.twitter.follow.dto;

import lombok.Data;

@Data
public class UserDTO {
	
	private Long userId;
	private String firstName;
	private String lastName;
	private String emailId;
	private String bio;
	private String profilePicture;
	
}
