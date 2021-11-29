package com.nierot.tawa.entity;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@ToString
@Setter
public class Playlist {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    // Session ID
    private Long id;

    @Column(name = "name", nullable = false)
    // Playlist name
    private String name;

    @OneToOne(targetEntity = User.class)
    @JoinColumn(name = "uid", nullable = false)
    // User ID of the user who made this playlist
    private User user;

    // List of songs, can be null if empty
    @OneToMany(targetEntity = Song.class)
    private List<Song> songs;

    // When this playlist has been made
    @Column(name = "dateCreated", nullable = false)
    private long dateCreated;

    public Playlist(String name, User user) {
        this.name = name;
        this.user = user;
    }

    @PrePersist
    void dateCreated() {
        this.dateCreated = new Date().getTime();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Playlist playlist = (Playlist) o;
        return id != null && Objects.equals(id, playlist.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
