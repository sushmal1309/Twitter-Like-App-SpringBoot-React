package com.infy.twitter.user.utility;

import org.apache.logging.log4j.LogManager;

import org.apache.logging.log4j.Logger;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class UserLoggingAspect {
	
	private final static Logger LOGGER = LogManager.getLogger(UserLoggingAspect.class);
	
	@AfterThrowing(pointcut="execution(* com.infy.twitter.user.*.*(..))",throwing = "exception")
	public void afterThrowingLogger(Exception exception) {
		LOGGER.error(exception.getMessage());
	}

}
