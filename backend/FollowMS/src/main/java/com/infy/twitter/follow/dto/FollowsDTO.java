package com.infy.twitter.follow.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FollowsDTO {
	private Long id;
	@NotBlank(message = "{userId.empty}")
	private Long userId;
	@NotBlank(message = "{followerId.empty}")
	private Long followerId;
	private LocalDateTime followedAt;
}
