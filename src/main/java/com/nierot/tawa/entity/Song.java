package com.nierot.tawa.entity;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

// https://spring.io/guides/gs/accessing-data-jpa/
@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Song {

    public static enum SongType {
        Spotify,
        YouTube
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "songType", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private SongType songType;

    @Column(name = "title", nullable = false)
    private String title;

    // Amount of times this song has been played before
    @Column(name = "plays", nullable = false)
    private int plays = 0;

    // Either a YouTube id or a spotify id
    @Column(name = "platformId", nullable = false)
    private String platformId;

    // Username of the person who added this song to the database
    @Column(name =  "addedBy", nullable = false)
    private String addedBy;

    /*
        All values below are nullable since they are only (at this time) used by the Spotify type
     */

    // Artist can be nullable since not every songType has an artist
    private String artist;

    // A link to the cover jpeg
    private String cover;

    // The length of the song in ms
    private long length;

    public Song(String title, String platformId, SongType songType, String addedBy) {
        this.title      = title;
        this.platformId = platformId;
        this.songType   = songType;
        this.addedBy    = addedBy;
    }
//
//    public Song(String title, String platformId, SongType songType, String addedBy, String artist,
//                String cover, long length) {
//        this.title      = title;
//        this.platformId = platformId;
//        this.songType   = songType;
//        this.addedBy    = addedBy;
//        this.artist     = artist;
//        this.cover      = cover;
//        this.length     = length;
//    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Song song = (Song) o;
        return id != null && Objects.equals(id, song.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
