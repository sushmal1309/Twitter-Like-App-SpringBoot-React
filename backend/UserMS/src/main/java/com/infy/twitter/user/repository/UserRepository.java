package com.infy.twitter.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.infy.twitter.user.entity.LocationEnabled;
import com.infy.twitter.user.entity.User;

import jakarta.transaction.Transactional;

@Transactional
@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	
	public Optional<User> findByEmailId(String emailId);
	public Optional<User> findByFirstName(String firstName);
	
	
	
	@Query("select u.emailId from User u")
	public List<String> fetchAllUserEmails();
	
	@Modifying
	@Query("update User u set "
			+ "u.bio = coalesce(:#{#user.bio},u.bio),"
			+ "u.location = coalesce(:#{#user.location},u.location),"
			+ "u.website = coalesce(:#{#user.website},u.website),"
			+ "u.profilePicture = coalesce(:#{#user.profilePicture},u.profilePicture),"
			+ "u.coverPhoto = coalesce(:#{#user.coverPhoto},u.coverPhoto)"
			+ "where u.userId = :#{#user.userId}"
			)
	public void updateUser(@Param("user") User user);
	
	@Modifying
	@Query("update User u set u.password = ?2 where u.emailId = ?1")
	public void resetPassword(String emailId,String password);
	
	
	@Query("select u from User u where concat(u.firstName,' ',u.lastName) LIKE concat('%',:name,'%') or "
			+ "lower(u.firstName) LIKE concat('%',:name,'%') or lower(u.lastName) LIKE concat('%',:name,'%')")
	public List<User> searchByName(@Param("name") String name);
	
	@Modifying
	@Query("update User u set u.isLocationEnabled=:enabled where u.userId=:userId")
	public void updateLocationPrivacy(@Param("userId") Long userId,@Param("enabled") LocationEnabled enabled);
}

 