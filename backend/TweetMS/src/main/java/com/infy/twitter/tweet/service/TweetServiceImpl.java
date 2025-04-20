package com.infy.twitter.tweet.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.infy.twitter.tweet.dto.MediaDTO;
import com.infy.twitter.tweet.dto.TweetDTO;
import com.infy.twitter.tweet.entity.ReplyOrRetweet;
import com.infy.twitter.tweet.entity.Tweet;
import com.infy.twitter.tweet.entity.TweetType;
import com.infy.twitter.tweet.repository.ReplyOrRetweetReposiory;
import com.infy.twitter.tweet.repository.TweetRepository;

import jakarta.transaction.Transactional;

@Service("TweetService")
@Transactional
public class TweetServiceImpl implements TweetService{
	
	private ModelMapper modelMapper = new ModelMapper();	
	
	@Autowired
	private TweetRepository tweetRepository;
	
	@Autowired
	private ReplyOrRetweetReposiory replyOrRetweetReposiory;
	
	
	@Autowired
    private WebClient.Builder webClientBuilder;
	
	Tweet prepareTweet(TweetDTO tweetDTO) {
		Tweet t = new Tweet();
		t.setUserId(tweetDTO.getUserId());
		t.setTweetContent(tweetDTO.getTweetContent());
		t.setLikes(tweetDTO.getLikes());
		t.setCreatedAt(tweetDTO.getCreatedAt());
		t.setType(tweetDTO.getType());
		t.setUpdatedAt(tweetDTO.getUpdatedAt());
		return t;
	}
	
	List<MediaDTO> getByTweetId(Long tweetId) {
		return webClientBuilder.build().get().uri("http://localhost:8082/media/"+tweetId).retrieve().bodyToMono(List.class).block();
	}
	

	@Override
	public TweetDTO postTweet(TweetDTO tweetDTO, Long tweetId) {
		// TODO Auto-generated method stub
		Tweet tweet = this.prepareTweet(tweetDTO);
		tweet = tweetRepository.save(tweet);
		
		List<MediaDTO> medias = tweetDTO.getMedia();
		List<MediaDTO> updatedMedia = new ArrayList<>();
		if(medias.size()>0) {
			for(MediaDTO m:medias) {
				m.setTweetId(tweet.getTweetId());
				m.setCreatedAt(tweet.getCreatedAt());
				m.setUserId(tweet.getUserId());
				MediaDTO mdto = webClientBuilder.build().post().uri("http://localhost:8082/media/upload").bodyValue(m).retrieve().bodyToMono(MediaDTO.class).block();
				updatedMedia.add(mdto);
			}
		}
		/*If the type is reply or retweet, then set a record in reply_or_retweet table with replied tweet id 
		 * and on which tweet it was replied*/
		if(!tweetDTO.getType().equals(TweetType.TWEET)) {			
			ReplyOrRetweet reply = new ReplyOrRetweet();
			reply.setTweetId(tweet.getTweetId());
			reply.setForTweetId(tweetId);
			replyOrRetweetReposiory.save(reply);
		}
		TweetDTO t = modelMapper.map(tweet,TweetDTO.class);
		t.setMedia(updatedMedia);
		return t;
	}

	@Override
	public List<TweetDTO> getTweetsByUserId(Long userId) {
		// TODO Auto-generated method stub
		List<Tweet> tweets = tweetRepository.findByUserIdAndType(userId,TweetType.TWEET);
		List<TweetDTO> tweetsList = modelMapper.map(tweets, new TypeToken<List<TweetDTO>>() {
		}.getType());
		
		for(TweetDTO t: tweetsList) {			
			t.setMedia(this.getByTweetId(t.getTweetId()));
		}
		return tweetsList;	
	}
	@Override
	public List<TweetDTO> getReTweetsByUserId(Long userId) {
		// TODO Auto-generated method stub
		List<Tweet> tweets = tweetRepository.findByUserIdAndType(userId,TweetType.RETWEET);
		List<TweetDTO> tweetsList = modelMapper.map(tweets, new TypeToken<List<TweetDTO>>() {
		}.getType());
		
		for(TweetDTO t: tweetsList) {			
			t.setMedia(this.getByTweetId(t.getTweetId()));
		}
		return tweetsList;	
	}
	
	@Override
    public TweetDTO updateTweet(Long id, TweetDTO tweetDTO) {
        Optional<Tweet> tweet = tweetRepository.findById(id);
        if (tweet.isPresent()) {
            Tweet updatedTweet = tweet.get();
            updatedTweet.setTweetContent(tweetDTO.getTweetContent());
            updatedTweet.setUpdatedAt(tweetDTO.getUpdatedAt());
            updatedTweet = tweetRepository.save(updatedTweet);
            
            List<MediaDTO> mediaDTOs = tweetDTO.getMedia();
            List<MediaDTO> updatedMediaDTO = new ArrayList<>();
            for(MediaDTO mediaDTO: mediaDTOs) {
            	if(mediaDTO.getIsDelete()) {
            		webClientBuilder.build().delete().uri("http://localhost:8082/media/delete/"+mediaDTO.getMediaId()).retrieve().toBodilessEntity().block();
            	}
            	else if(mediaDTO.getMediaId() == null || mediaDTO.getMediaId().toString().isEmpty()){
            		mediaDTO.setTweetId(tweetDTO.getTweetId());
            		mediaDTO.setCreatedAt(tweetDTO.getCreatedAt());
            		mediaDTO.setUserId(tweetDTO.getUserId());
            		MediaDTO media = webClientBuilder.build().post().uri("http://localhost:8082/media/upload").bodyValue(mediaDTO).retrieve().bodyToMono(MediaDTO.class).block();
            		updatedMediaDTO.add(media);
            	}
            }
         
            TweetDTO tweetdto = modelMapper.map(updatedTweet, TweetDTO.class);
            tweetdto.setMedia(updatedMediaDTO);
        }
        return null;
    }

    @Override
    public void deleteTweet(Long id) {
    	Tweet t = tweetRepository.findById(id).get();
    	if(t.getType().equals(TweetType.REPLY)) {
    		tweetRepository.deleteById(id);
    		replyOrRetweetReposiory.deleteById(id);
    	}
    	else {
    		List<ReplyOrRetweet> lst = replyOrRetweetReposiory.findByForTweetId(id);
    		for(ReplyOrRetweet r: lst) {
    			if(tweetRepository.findById(r.getTweetId()).get().getType().equals(TweetType.REPLY)){
    				tweetRepository.deleteById(r.getTweetId());
    			}    			
    			replyOrRetweetReposiory.deleteById(r.getTweetId());
    		}
    		tweetRepository.deleteById(id);
    	}        
		webClientBuilder.build().delete().uri("http://localhost:8082/media/delete?tweetId="+t.getTweetId()).retrieve().toBodilessEntity().block();
    }

    @Override
    public void likeTweet(Long id) {
        Optional<Tweet> tweet = tweetRepository.findById(id);
        if (tweet.isPresent()) {
            Tweet likedTweet = tweet.get();
            likedTweet.setLikes(likedTweet.getLikes() + 1);
            tweetRepository.save(likedTweet);
        }
    }

    @Override
    public void dislikeTweet(Long id) {
        Optional<Tweet> tweet = tweetRepository.findById(id);
        if (tweet.isPresent()) {
            Tweet dislikedTweet = tweet.get();
            dislikedTweet.setLikes(dislikedTweet.getLikes() - 1);
            tweetRepository.save(dislikedTweet);
        }
    }
    
    public int getAllLikesById(Long tweetId) {
    	Optional<Tweet> tweet = tweetRepository.findById(tweetId);    	
    	return tweet.isPresent()?tweet.get().getLikes():0;
    }

	@Override
	public List<TweetDTO> getAll(String type,Long tweetId) {
		// TODO Auto-generated method stub
		type = type.toUpperCase();
		if(type.equals(TweetType.REPLY.toString()) || type.equals(TweetType.RETWEET.toString())) {
			List<Tweet> lst = tweetRepository.getAll(TweetType.valueOf(type),tweetId);
			List<TweetDTO> tweetsList = modelMapper.map(lst, new TypeToken<List<TweetDTO>>() {
			}.getType());
			for(TweetDTO t: tweetsList) {
				t.setMedia(this.getByTweetId(t.getTweetId()));
			}
			return tweetsList;	
		}
		return null;
	}

	@Override
	public List<TweetDTO> getTweetsByContainingText(String text) {
		// TODO Auto-generated method stub
		List<Tweet> lst = tweetRepository.findByTweetContentContainingIgnoreCase(text);
		List<TweetDTO> tweetsList = modelMapper.map(lst, new TypeToken<List<TweetDTO>>() {
		}.getType());
		for(TweetDTO t: tweetsList) {
			t.setMedia(this.getByTweetId(t.getTweetId()));
		}
		return tweetsList;
	}

	@Override
	public TweetDTO getTweetByTweetId(Long tweetId) {
		// TODO Auto-generated method stub
		
		Optional<Tweet> opTweet = tweetRepository.findById(tweetId);
		if(opTweet.isPresent()) {
			Tweet tweet = opTweet.get();
			TweetDTO tweetDTO = modelMapper.map(tweet, TweetDTO.class);
			tweetDTO.setMedia(this.getByTweetId(tweetDTO.getTweetId()));
			return tweetDTO;
		}
		else {
			return null;
		}		
		
	}

	@Override
	public List<TweetDTO> getTweetsByFollowersId(List<Long> followerIds) {
		// TODO Auto-generated method stub
		List<TweetDTO> tweetsListDTO = new ArrayList<>();
		for(Long id:followerIds) {
			List<Tweet> lst = tweetRepository.findTop5ByUserIdAndTypeOrderByCreatedAtDesc(id, TweetType.TWEET);
			List<TweetDTO> tweetsList = modelMapper.map(lst, new TypeToken<List<TweetDTO>>() {
			}.getType());
			for(TweetDTO t: tweetsList) {
				t.setMedia(this.getByTweetId(t.getTweetId()));
			}
			tweetsListDTO.addAll(tweetsList);
		}
		return tweetsListDTO;
	}   
    	
}
