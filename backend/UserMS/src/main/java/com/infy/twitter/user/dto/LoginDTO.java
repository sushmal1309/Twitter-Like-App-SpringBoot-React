package com.infy.twitter.user.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginDTO {
	
	@NotNull
	private String emailId;
	@NotNull
	@Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!?%^&])[A-Za-z\\d@#$!?%^&]{8,16}$",message = "{password.invalid}")
	private String password;
			
}
