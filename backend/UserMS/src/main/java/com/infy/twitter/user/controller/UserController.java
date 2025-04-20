package com.infy.twitter.user.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infy.twitter.user.dto.BasicUserDTO;
import com.infy.twitter.user.dto.LoginDTO;
import com.infy.twitter.user.dto.UpdateDTO;
import com.infy.twitter.user.dto.UserDTO;
import com.infy.twitter.user.exception.UserException;
import com.infy.twitter.user.service.UserService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
@OpenAPIDefinition(info = @Info(title = "User MS endpoints",description = "Find all the user related operations webservices"))
public class UserController {
	
	@Autowired
	UserService userService;
	
	@Operation(summary = "Registers an user to twitter application.")
	@ApiResponses(value = {@ApiResponse(responseCode = "201",description = "User account created successfully"), 
			@ApiResponse(responseCode = "400",description = "Email already exists or validation errors")})
	@PostMapping("/signup")
	public ResponseEntity<UserDTO> registerUser(@RequestBody @Valid UserDTO userDTO) throws UserException {
		UserDTO response = userService.registerUser(userDTO);
		return new ResponseEntity<UserDTO>(response, HttpStatus.CREATED);
		
	}
	
	@Operation(summary = "Authenticate user to login.")
	@ApiResponses(value = {@ApiResponse(responseCode = "200",description = "User login successful"), 
			@ApiResponse(responseCode = "400",description = "Incorrect Email/Password")})
	@PostMapping("/login")
	@CircuitBreaker(name="authenticateService", fallbackMethod = "authenticateUserFallback")
	public ResponseEntity<HashMap<String, UserDTO>> authenticateUser(@RequestBody @Valid LoginDTO loginDTO) throws UserException {
		HashMap<String, UserDTO> userData = userService.authenticateUser(loginDTO);
		return new ResponseEntity<HashMap<String, UserDTO>>(userData, HttpStatus.OK);
	}
	
	public ResponseEntity<UserDTO> authenticateUserFallback(LoginDTO loginDTO,Throwable t){
		UserDTO userDTO = new UserDTO();
		userDTO.setUserId(404L);
		userDTO.setFirstName("");
		userDTO.setLastName("");
		userDTO.setEmailId("");

		return new ResponseEntity<>(userDTO,HttpStatus.BAD_REQUEST);
	}
	
	@Operation(summary = "Fetches list of user email ids.") 
	@ApiResponse(responseCode = "200",description = "List of user email ids")	
	@GetMapping("/userEmails")
	public ResponseEntity<List<String>> getUserEmails(){
		List<String> userEmails = userService.getUserEmails();
		return new ResponseEntity<List<String>>(userEmails, HttpStatus.OK);
	}
	
	@Operation(summary = "Updated the user profile informations") 
	@ApiResponse(responseCode = "200",description = "user profile updated")
	@PutMapping("/update")
	public ResponseEntity<String> updateUserProfile(@RequestBody @Valid UpdateDTO updateDTO) throws UserException {
		String msg = userService.updateUserProfile(updateDTO);
		return new ResponseEntity<>(msg,HttpStatus.OK);
	}
	
	@Operation(summary = "User to reset password") 
	@ApiResponse(responseCode = "200",description = "Password reset successful")
	@PutMapping("/resetPassword")
	public ResponseEntity<String> resetPassword(@RequestBody @Valid LoginDTO loginDTO) throws UserException{
		String response = userService.resetPassword(loginDTO);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<UserDTO> getByUserId(@PathVariable Long userId){
		return new ResponseEntity<UserDTO>(userService.getByUserId(userId), HttpStatus.OK);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<BasicUserDTO>> searchForUser(@RequestParam("query") String text){
		return new ResponseEntity<>(userService.searchByName(text),HttpStatus.OK);
	}
	
	@PostMapping("/profiles")
	public ResponseEntity<List<BasicUserDTO>> getByUserIdsList(@RequestBody List<Long> userIdsList){
		return new ResponseEntity<List<BasicUserDTO>>(userService.getByUserIds(userIdsList), HttpStatus.OK);
	}
	
	@GetMapping("/privacy/{userId}")
	public ResponseEntity<Void> setLocationPrivacy(@PathVariable Long userId, @RequestParam String enabled) {
		userService.setLocationPrivacy(userId, enabled);
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
