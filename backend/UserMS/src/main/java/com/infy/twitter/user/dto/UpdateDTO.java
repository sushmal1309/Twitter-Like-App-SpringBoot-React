package com.infy.twitter.user.dto;

import lombok.Data;

@Data
public class UpdateDTO {
	
	private Long userId;
	private String bio;
	private String location;
	private String website;
	private String profilePicture;
	private String coverPhoto;
}
