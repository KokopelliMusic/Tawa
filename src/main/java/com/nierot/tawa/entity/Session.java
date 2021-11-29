package com.nierot.tawa.entity;

import com.nierot.tawa.Util;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
public class Session {

    @Id
    @Column(name = "sid", nullable = false, length = 4)
    // Session ID
    private String sid;

    // User ID
    @OneToOne(targetEntity = User.class)
    @JoinColumn(name = "user", nullable = false)
    private User user;

    // Playlist ID
    @ManyToOne(targetEntity = Playlist.class)
    @JoinColumn(name = "playlist", nullable = false)
    private Playlist playlist;

    // When has this session begun
    @Column(name = "started", nullable = false)
    private long started;

    // List of users
    @ManyToMany(targetEntity = User.class)
    @Column(name = "users", nullable = false)
    private List<User> users;

    /**
     * Construct a new Session object, on generation this also generates its sid (session id) and it records
     * when it has started.
     * @param user The user who started this session
     * @param playlist The playlist that is being played
     */
    public Session(User user, Playlist playlist) {
        this.sid        = Util.generateRandomString(4);
        this.user       = user;
        this.playlist   = playlist;
        this.users      = new ArrayList<>();

        this.users.add(user);
    }

    public Session() {
        this.sid    = Util.generateRandomString(4);
        this.users  = new ArrayList<>();
    }

    @PrePersist
    void started() {
        this.started = new Date().getTime();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Session session = (Session) o;
        return sid != null && Objects.equals(sid, session.sid);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
