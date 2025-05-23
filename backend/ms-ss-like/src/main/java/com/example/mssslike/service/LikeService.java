package com.example.mssslike.service;

import com.example.mssslike.dto.LikeRequestDto;
import com.example.mssslike.entity.Like;
import com.example.mssslike.repository.LikeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;

    public Like createLike(LikeRequestDto likeRequestDto){
        Like like = new Like();
        like.setUsername(likeRequestDto.getUsername());
        like.setPostId(likeRequestDto.getPostId());
        return likeRepository.save(like);
    }

    public Integer getLikeCountByPostId(Integer postId){
        return likeRepository.countByPostId(postId);
    }

    public void deleteLike(LikeRequestDto likeRequestDto){
        Optional<Like> like = likeRepository.findByUsernameAndPostId(likeRequestDto.getUsername(), likeRequestDto.getPostId());
        like.ifPresent(likeRepository::delete);
    }

    public void deleteAllByPostId(Integer postId) {
        likeRepository.deleteAllByPostId(postId);
    }

    @Transactional
    public void deleteAllByUsername(String username) {
        likeRepository.deleteAllByUsername(username);
    }
}
