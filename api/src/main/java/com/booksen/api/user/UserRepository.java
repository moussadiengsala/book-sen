package com.booksen.api.user;

import com.booksen.api.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findUserByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByRole(Role role);
    boolean existsByRole(Role role);
}