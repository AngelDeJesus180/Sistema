package com.example.proyectodenivelacion.config;

import com.example.proyectodenivelacion.model.User;
import com.example.proyectodenivelacion.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Usuarios normales
            crearUsuario(userRepository, passwordEncoder, "angel", "1234", "ROLE_USER");
            crearUsuario(userRepository, passwordEncoder, "maria", "1234", "ROLE_USER");
            crearUsuario(userRepository, passwordEncoder, "pedro", "1234", "ROLE_USER");
            crearUsuario(userRepository, passwordEncoder, "andres", "1234", "ROLE_USER");

            // EL JEFE
            crearUsuario(userRepository, passwordEncoder, "admin", "12345", "ROLE_ADMIN");

            System.out.println("--> ¡Usuarios y Roles cargados sin errores!");
        };
    }

    private void crearUsuario(UserRepository repo, PasswordEncoder encoder, String username, String pass, String role) {
        if (repo.findByUsername(username).isEmpty()) {
            User nuevoUsuario = new User();
            nuevoUsuario.setUsername(username);
            nuevoUsuario.setPassword(encoder.encode(pass));
            nuevoUsuario.setRole(role); // Ahora sí funcionará porque lo agregamos a la clase User
            repo.save(nuevoUsuario);
        }
    }
}