package com.infy.twitter.tweet.utility;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TweetLoggingAspect {
	
	private final static Logger log = LogManager.getLogger(TweetLoggingAspect.class);
	
	@AfterThrowing(pointcut="execution(* com.infy.twitter.tweet.*.*(..))",throwing = "exception")
	public void afterThrowingLogger(Exception exception) {
		log.error(exception.getMessage());
	}
}
