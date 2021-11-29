package com.nierot.tawa.repository;

import com.nierot.tawa.entity.Song;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "song", path = "song")
public interface SongRepository extends PagingAndSortingRepository<Song, Long> {

    List<Song> findByPlays(@Param("plays") int plays);
}
