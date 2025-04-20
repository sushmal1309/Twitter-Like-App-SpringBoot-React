package com.infy.twitter.user.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class User {
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	private Long userId;
	private String firstName;
	private String lastName;
	private String emailId;
	private LocalDate dateOfBirth;
	private String password;
	private LocalDate joinedDate;
	private String bio;
	private String location;
	private String website;
	private String profilePicture;
	@Column(columnDefinition = "TEXT")
	private String coverPhoto;
	@Enumerated(EnumType.STRING)
	private LocationEnabled isLocationEnabled=LocationEnabled.FALSE;
	
}
