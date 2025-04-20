package com.infy.twitter.search.dto;

import lombok.Data;

@Data
public class BasicUserDTO {
	private Long userId;
	private String firstName;
	private String lastName;
	private String emailId;
	private String profilePicture;
	private String bio;
}
