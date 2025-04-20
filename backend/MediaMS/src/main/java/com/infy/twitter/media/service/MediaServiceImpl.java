package com.infy.twitter.media.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infy.twitter.media.dto.MediaDTO;
import com.infy.twitter.media.entity.Media;
import com.infy.twitter.media.repository.MediaRepository;

import jakarta.transaction.Transactional;

@Service("MediaService")
@Transactional
public class MediaServiceImpl implements MediaService {
	
	ModelMapper modelMapper = new ModelMapper();
	
	@Autowired
	private MediaRepository mediaRepository;

	@Override
	public MediaDTO createMedia(MediaDTO mediaDTO) {
		// TODO Auto-generated method stub
		Media media = modelMapper.map(mediaDTO, Media.class);
		media = mediaRepository.save(media);
		return modelMapper.map(media, MediaDTO.class);
	}
	
	@Override
    public MediaDTO getMediaById(Long mediaIid) {
        Optional<Media> media = mediaRepository.findById(mediaIid);
        return media.map(value -> modelMapper.map(value, MediaDTO.class)).orElse(null);
    }

    @Override
    public List<MediaDTO> getMediaByTweetId(Long tweetId) {
        List<Media> mediaList = mediaRepository.findByTweetId(tweetId);
        return mediaList.stream().map(media -> modelMapper.map(media, MediaDTO.class)).collect(Collectors.toList());
    }

    @Override
    public void deleteMedia(Long mediaId) {
        mediaRepository.deleteById(mediaId);
    }

	@Override
	public void deleteByTweetId(Long tweetId) {
		// TODO Auto-generated method stub
		mediaRepository.deleteByTweetId(tweetId);
		
	}


}
