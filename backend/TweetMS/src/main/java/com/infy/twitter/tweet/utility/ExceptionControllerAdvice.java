package com.infy.twitter.tweet.utility;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.infy.twitter.tweet.exception.TweetException;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class ExceptionControllerAdvice {
	
	@Autowired
    Environment environment;
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorInfo> pathVarValidatorExceptionHandler(ConstraintViolationException exception) {
    	ErrorInfo error = new ErrorInfo();
    	String errorMsg = ((ConstraintViolationException) exception).getConstraintViolations().stream().map(e->e.getMessage()).collect(Collectors.joining(","));
    	error.setErrorMessage(errorMsg);
    	error.setErrorCode(HttpStatus.BAD_REQUEST.value());
    	error.setTimestamp(LocalDateTime.now());
    	
    	return new ResponseEntity<ErrorInfo>(error,HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorInfo> validatorExceptionHandler(MethodArgumentNotValidException exception) {
    	ErrorInfo error = new ErrorInfo();
    	String errorMsg = exception.getBindingResult().getAllErrors().stream().map((e)->e.getDefaultMessage()).collect(Collectors.joining(","));
    	error.setErrorMessage(errorMsg);
    	error.setErrorCode(HttpStatus.BAD_REQUEST.value());
    	error.setTimestamp(LocalDateTime.now());
    	
    	return new ResponseEntity<ErrorInfo>(error,HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(TweetException.class)
    public ResponseEntity<ErrorInfo> userExceptionHandler(TweetException exception) {
    	ErrorInfo error = new ErrorInfo();
    	error.setErrorMessage(exception.getMessage());
        error.setErrorCode(HttpStatus.BAD_REQUEST.value());
        error.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<ErrorInfo>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorInfo> generalExceptionHandler(Exception exception) {
    	ErrorInfo error = new ErrorInfo();
    	error.setErrorMessage(environment.getProperty("General.ExceptionMessage"));
        error.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<ErrorInfo>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
