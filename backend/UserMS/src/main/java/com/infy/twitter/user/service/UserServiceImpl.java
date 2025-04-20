package com.infy.twitter.user.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.infy.twitter.user.config.JwtService;
import com.infy.twitter.user.dto.BasicUserDTO;
import com.infy.twitter.user.dto.LoginDTO;
import com.infy.twitter.user.dto.UpdateDTO;
import com.infy.twitter.user.dto.UserDTO;
import com.infy.twitter.user.entity.LocationEnabled;
import com.infy.twitter.user.entity.User;
import com.infy.twitter.user.exception.UserException;
import com.infy.twitter.user.repository.UserRepository;


import jakarta.transaction.Transactional;

@Service("UserService")
@Transactional
public class UserServiceImpl implements UserService{
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	private ModelMapper modelMapper = new ModelMapper();
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private Environment env;
	

	public BasicUserDTO prepareBasicUserDTO(User user) {
		BasicUserDTO basicDTO = new BasicUserDTO();
		basicDTO.setUserId(user.getUserId());
		basicDTO.setFirstName(user.getFirstName());
		basicDTO.setLastName(user.getLastName());
		basicDTO.setEmailId(user.getEmailId());
		basicDTO.setBio(user.getBio());
		basicDTO.setProfilePicture(user.getProfilePicture());
		return basicDTO;
	}

	@Override
	public UserDTO registerUser(UserDTO userDTO) throws UserException {
		User user = modelMapper.map(userDTO, User.class);
		
		Optional<User> existingUser = userRepository.findByEmailId(userDTO.getEmailId());
		
		if(existingUser.isPresent()) {
			throw new UserException(env.getProperty("Service.Register.UserExists"));
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		User response = userRepository.save(user);		
		return modelMapper.map(response, UserDTO.class);
	}


	@Override
	public HashMap<String, UserDTO> authenticateUser(LoginDTO loginDTO)throws UserException {
		
		Optional<User> user = userRepository.findByEmailId(loginDTO.getEmailId());
		User usr = user.orElseThrow(()->new UserException(env.getProperty("Service.Login.EmailError")));
		if(passwordEncoder.matches(loginDTO.getPassword(),usr.getPassword() )) {
			System.out.println("matches");
			String jwtToken =jwtService.generateToken(usr.getEmailId());
			UserDTO userDTO= modelMapper.map(usr, UserDTO.class);
			HashMap<String, UserDTO> map=new HashMap<>();
			map.put(jwtToken, userDTO);
			return map;
			
		}
		else {
			System.out.println("error");
			throw new UserException(env.getProperty("Service.Login.PasswordError"));
		}
	}
	
	@Override
	public List<String> getUserEmails() {
		
		return userRepository.fetchAllUserEmails();
	}

	@Override
	public String updateUserProfile(UpdateDTO updateDTO) throws UserException {
		
		Optional<User> op = userRepository.findById(updateDTO.getUserId());
		User usr = op.orElseThrow(()->new UserException(env.getProperty("Service.Login.EmailError")));
		usr = modelMapper.map(updateDTO, User.class);

		userRepository.updateUser(usr);
		
		return env.getProperty("Service.Profile.Update");
	}
	
	
	public String resetPassword(LoginDTO loginDTO) throws UserException {
		Optional<User> op = userRepository.findByEmailId(loginDTO.getEmailId());
		op.orElseThrow(()->new UserException(env.getProperty("Service.Login.EmailError")));
		
		loginDTO.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
		userRepository.resetPassword(loginDTO.getEmailId(), loginDTO.getPassword());
		
		String msg = env.getProperty("Service.PasswordReset.Success");
		return msg;
	}

	@Override
	public UserDTO getByUserId(Long userId) {
		
		Optional<User> user = userRepository.findById(userId);
		if(user.isPresent()) {
			UserDTO userDTO = modelMapper.map(user.get(), UserDTO.class);
			userDTO.setPassword("");
			return userDTO;
		}
		return null;
	}

	@Override
	public List<BasicUserDTO> getByUserIds(List<Long> userIds) {
		
		List<BasicUserDTO> basicDTO = new ArrayList<>();
		for(Long userId:userIds) {
			Optional<User> user = userRepository.findById(userId);
			if(user.isPresent()) {
				basicDTO.add(this.prepareBasicUserDTO(user.get()));
			}
		}
 		return basicDTO;
	}

	@Override
	public List<BasicUserDTO> searchByName(String searchText) {
		
		List<BasicUserDTO> searchResults = new ArrayList<>();
		List<User> users = userRepository.searchByName(searchText.toLowerCase());
		for(User user:users) {
			searchResults.add(this.prepareBasicUserDTO(user));
		}
		return searchResults;
	}

	@Override
	public void setLocationPrivacy(Long userId, String enabled) {
		
		userRepository.updateLocationPrivacy(userId, LocationEnabled.valueOf(enabled.toUpperCase()));
	}
	

}
