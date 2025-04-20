package com.infy.twitter.user.dto;

import java.time.LocalDate;

import com.infy.twitter.user.entity.LocationEnabled;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserDTO {
	
	private Long userId;
	@NotNull
	@Pattern(regexp = "([A-Z][a-z]+)( [A-Z][a-z]*)*",message = "{name.invalid}")
	private String firstName;
	private String lastName;
	@NotNull
	@Pattern(regexp = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",message = "{email.invalid}")
	private String emailId;
	@NotNull
	private LocalDate dateOfBirth;
	@NotNull
	@Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!?%^&])[A-Za-z\\d@#$!?%^&]{8,16}$",message = "{password.invalid}")
	private String password;
	@NotNull
	private LocalDate joinedDate;
	private String bio;
	private String location;
	private String website;
	private String profilePicture;
	private String coverPhoto;
	private LocationEnabled isLocationEnabled;
	
}
