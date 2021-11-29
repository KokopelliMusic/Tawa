package com.nierot.tawa.entity;

import com.nierot.tawa.repository.PlaylistRepository;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "uid", nullable = false)
    private Long uid;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(targetEntity = Playlist.class)
    @ToString.Exclude
    private List<Playlist> playlists;

    public User(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        User user = (User) o;
        return uid != null && Objects.equals(uid, user.uid);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
