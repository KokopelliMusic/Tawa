package com.nierot.tawa.repository;

import com.nierot.tawa.entity.User;
import org.springframework.data.repository.CrudRepository;

public abstract class UserRepository implements CrudRepository<User, Long> {}
