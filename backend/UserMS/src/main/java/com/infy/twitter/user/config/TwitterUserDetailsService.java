package com.infy.twitter.user.config;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.infy.twitter.user.entity.User;
import com.infy.twitter.user.repository.UserRepository;
@Service
public class TwitterUserDetailsService implements UserDetailsService{
	@Autowired
    private UserRepository userRepository;
	@Override
    public UserDetails loadUserByUsername(String emailId)  {
        Optional<User> optinal = userRepository.findByEmailId(emailId);
        if(optinal.isEmpty())
        {
        	throw new UsernameNotFoundException("User Not Found");
        }
        User user=optinal.get();
return new org.springframework.security.core.userdetails.User(
                user.getEmailId(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

}
