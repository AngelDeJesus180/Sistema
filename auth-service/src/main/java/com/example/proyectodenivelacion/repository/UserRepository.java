package com.example.proyectodenivelacion.repository;

import com.example.proyectodenivelacion.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Este método es el que usará el DataInitializer y el AuthController
    Optional<User> findByUsername(String username);
}