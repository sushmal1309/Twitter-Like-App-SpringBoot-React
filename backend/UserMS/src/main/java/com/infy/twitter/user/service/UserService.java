package com.infy.twitter.user.service;

import java.util.HashMap;
import java.util.List;

import com.infy.twitter.user.dto.BasicUserDTO;
import com.infy.twitter.user.dto.LoginDTO;
import com.infy.twitter.user.dto.UpdateDTO;
import com.infy.twitter.user.dto.UserDTO;
import com.infy.twitter.user.exception.UserException;

public interface UserService {
	
	public UserDTO registerUser(UserDTO userDTO) throws UserException;
	
	public HashMap<String, UserDTO> authenticateUser(LoginDTO loginDTO) throws UserException;
	
	public List<String> getUserEmails();
	
	public String updateUserProfile(UpdateDTO updateDTO) throws UserException;
	
	public String resetPassword(LoginDTO loginDTO) throws UserException;
	
	public UserDTO getByUserId(Long userId);
	
	public List<BasicUserDTO> getByUserIds(List<Long> userIds);
	
	public List<BasicUserDTO> searchByName(String searchText);
	
	public void setLocationPrivacy(Long userId,String enabled);

}
