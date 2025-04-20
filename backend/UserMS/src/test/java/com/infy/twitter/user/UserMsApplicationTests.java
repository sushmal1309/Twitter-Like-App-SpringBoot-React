package com.infy.twitter.user;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.infy.twitter.user.config.JwtService;
import com.infy.twitter.user.dto.BasicUserDTO;
import com.infy.twitter.user.dto.LoginDTO;
import com.infy.twitter.user.dto.UpdateDTO;
import com.infy.twitter.user.dto.UserDTO;
import com.infy.twitter.user.entity.LocationEnabled;
import com.infy.twitter.user.entity.User;
import com.infy.twitter.user.exception.UserException;
import com.infy.twitter.user.repository.UserRepository;
import com.infy.twitter.user.service.UserService;
import com.infy.twitter.user.service.UserServiceImpl;

@SpringBootTest
class UserMsApplicationTests {
	
	@Mock
	private UserRepository userRepository;
	
	@Mock
	private ModelMapper modelMapper = new ModelMapper();
	
	@InjectMocks
	private UserService userService = new UserServiceImpl();
	
	@Mock
	private Environment env;
	
	@Mock
	private JwtService jwtService;
	
	@Mock
	PasswordEncoder passwordEncoder;
	
	@Test
	void registerValidTest() throws UserException {
		
		UserDTO userDTO = new UserDTO();
		userDTO.setEmailId("user@gmail.com");		
		
		User user = new User();
		user.setEmailId("user@gmail.com");
		
		User savedUser = new User();
		savedUser.setUserId(1L);
		savedUser.setEmailId("user@gmail.com");
		
		UserDTO expectedDTO = new UserDTO();
		expectedDTO.setUserId(1L);
		expectedDTO.setEmailId("user@gmail.com");
		
		Mockito.when(modelMapper.map(userDTO, User.class)).thenReturn(user);
		Mockito.when(userRepository.findByEmailId(user.getEmailId())).thenReturn(Optional.empty());
		Mockito.when(userRepository.save(user)).thenReturn(savedUser);
		Mockito.when(modelMapper.map(savedUser, UserDTO.class)).thenReturn(expectedDTO);		
		
		UserDTO actual = userService.registerUser(userDTO);
		Assertions.assertEquals(expectedDTO, actual);

	}
	
	@Test
	void registerInvalidTest() throws UserException {
		
		UserDTO userDTO = new UserDTO();
		userDTO.setEmailId("user@gmail.com");		
		
		User user = new User();
		user.setEmailId("user@gmail.com");
		
		User savedUser = new User();
		savedUser.setUserId(1L);
		savedUser.setEmailId("user@gmail.com");
		
		Optional<User> optionalSavedUser = Optional.of(new User());
		
		Mockito.when(modelMapper.map(userDTO, User.class)).thenReturn(user);
		Mockito.when(userRepository.findByEmailId(user.getEmailId())).thenReturn(optionalSavedUser);
		Mockito.when(env.getProperty("Service.Register.UserExists")).thenReturn("The email is already associated with an existing account");
		
		Assertions.assertThrows(UserException.class, ()->{userService.registerUser(userDTO);});	
	}
	
	@Test
	void authenticateValidTest() throws UserException {		
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setEmailId("user@gmail.com");
		loginDTO.setPassword("password89!");
		
		User user = new User();
		user.setEmailId("user@gmail.com");
		user.setPassword("password89!");
		
		UserDTO userDTO = new UserDTO();
		userDTO.setEmailId("user@gmail.com");
		userDTO.setPassword("password89!");
		
		String key = "jwttoken";
		
		HashMap<String,UserDTO> expected = new HashMap<>();
		expected.put(key,userDTO);
		
		Mockito.when(userRepository.findByEmailId(loginDTO.getEmailId())).thenReturn(Optional.of(user));
		
		Mockito.when(passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())).thenReturn(true);
		Mockito.when(jwtService.generateToken(user.getEmailId())).thenReturn(key);
		Mockito.when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);
		HashMap<String,UserDTO> actual = userService.authenticateUser(loginDTO);
		Assertions.assertEquals(expected, actual);	
	}
	
	@Test
	void authenticateInvalidTest() throws UserException {
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setEmailId("user@gmail.com");
		loginDTO.setPassword("password89!");
		
		User user = new User();
		user.setEmailId("user@gmail.com");
		user.setPassword("correct89!");
		
		Mockito.when(userRepository.findByEmailId(loginDTO.getEmailId())).thenReturn(Optional.of(user));
		Mockito.when(env.getProperty("Service.Login.PasswordError")).thenReturn("Incorrect password");
		
		Assertions.assertThrows(UserException.class,()-> userService.authenticateUser(loginDTO));	
	}
	
	@Test
	void getUserEmailsTest() {		
		List<String> expected = List.of("user@gmail.com");
		Mockito.when(userRepository.fetchAllUserEmails()).thenReturn(expected);
		List<String> actual = userService.getUserEmails();
		Assertions.assertEquals(1, actual.size());
	}
	
	@Test
	void updateProfileValidTest() throws UserException {
		UpdateDTO updateDTO = new UpdateDTO();
		updateDTO.setUserId(1L);
		updateDTO.setBio("Happy Being");
		
		User user = new User();
		user.setUserId(1L);
		user.setBio("Happy Being");
				
		Mockito.when(userRepository.findById(updateDTO.getUserId())).thenReturn(Optional.of(user));
		Mockito.when(modelMapper.map(updateDTO, User.class)).thenReturn(user);
		Mockito.doNothing().when(userRepository).updateUser(user);
		Mockito.when(env.getProperty("Service.Profile.Update")).thenReturn("Profile updated successfully");
		
		String actual = userService.updateUserProfile(updateDTO);
		Assertions.assertEquals("Profile updated successfully", actual);
	}
	
	@Test
	void resetPasswordValidTest() throws UserException {
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setEmailId("user@gmail.com");
		loginDTO.setPassword("password89!");
		
		Mockito.when(userRepository.findByEmailId(loginDTO.getEmailId())).thenReturn(Optional.of(new User()));
		Mockito.doNothing().when(userRepository).resetPassword(loginDTO.getEmailId(), loginDTO.getPassword());
		Mockito.when(env.getProperty("Service.PasswordReset.Success")).thenReturn("Password updated successfully");
		
		String actual = userService.resetPassword(loginDTO);
		Assertions.assertEquals("Password updated successfully", actual); 		
	}
	
	@Test
	void getUserByIdNullTest() {		
		Long userId = 1L;		
		Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());		
		UserDTO userDTO = userService.getByUserId(userId);		
		Assertions.assertEquals(null,userDTO);
	}
	
	@Test
	void getUserByIdNotNullTest() {		
		Long userId = 1L;		
		User user = new User();
		user.setUserId(userId);
		
		UserDTO userDTO = new UserDTO();
		userDTO.setUserId(userId);
		
		Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));	
		Mockito.when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);
		
		UserDTO actual = userService.getByUserId(userId);			
		Assertions.assertEquals(userDTO,actual);
	}
	
	@Test
	void getByUserIdsTest() {
		List<Long> usersIds = List.of(1L,2L);
		
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenReturn(Optional.of(new User()));
		List<BasicUserDTO> basicList = userService.getByUserIds(usersIds);
		
		Assertions.assertEquals(usersIds.size(), basicList.size());
		for(Long userId:usersIds) {
			Mockito.verify(userRepository).findById(userId);
		}			
		
	}
	
	@Test
	void searchByNameTest() {
		String name="John";
		BasicUserDTO basic1 = new BasicUserDTO();
		basic1.setFirstName("John");
		basic1.setLastName("Lin");
		
		BasicUserDTO basic2 = new BasicUserDTO();
		basic2.setFirstName("John");
		basic2.setLastName("Mathew");
		
		List<BasicUserDTO> basicList = List.of(basic1,basic2);
		
		User user1 = new User();
		user1.setFirstName("John");
		user1.setLastName("Lin");
		User user2 = new User();
		user2.setFirstName("John");
		user2.setLastName("Mathew");
		
		List<User> userList = List.of(user1,user2);
		
		Mockito.when(userRepository.searchByName(name.toLowerCase())).thenReturn(userList);
		
		List<BasicUserDTO> actual = userService.searchByName(name);
		Assertions.assertEquals(basicList.size(), actual.size());
		
		Mockito.verify(userRepository,Mockito.times(1)).searchByName(name.toLowerCase());
		
	}
	@Test
	void updateLocationTest()
	{
		Long userId=1L;
		String enabled="TRUE";
		Mockito.doNothing().when(userRepository).updateLocationPrivacy(userId,LocationEnabled.valueOf(enabled));
		userService.setLocationPrivacy(userId, enabled);
		
		boolean actual=true;
		boolean expected=true;
		Assertions.assertEquals(actual, expected);
	}
	
}
