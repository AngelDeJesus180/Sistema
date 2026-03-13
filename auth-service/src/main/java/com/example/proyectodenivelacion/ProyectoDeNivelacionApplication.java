package com.example.proyectodenivelacion;

import com.example.proyectodenivelacion.model.User;
import com.example.proyectodenivelacion.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ProyectoDeNivelacionApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoDeNivelacionApplication.class, args);
    }

    @Bean
    CommandLineRunner init(UserRepository userRepository) {
        return args -> {
            String username = "angel";

            // Lógica para no duplicar el usuario y que no truene el sistema
            if (userRepository.findByUsername(username).isPresent()) {
                System.out.println("--> [AUTH] El usuario '" + username + "' ya existe. Saltando creación.");
            } else {
                User testUser = new User();
                testUser.setUsername(username);
                testUser.setPassword("1234");
                userRepository.save(testUser);
                System.out.println("--> [AUTH] Usuario '" + username + "' creado exitosamente.");
            }

            System.out.println("******************************************");
            System.out.println("   SISTEMA DE AUTENTICACIÓN INICIADO      ");
            System.out.println("******************************************");
        }; // Cierra el lambda del return
    } // Cierra el método init
} // <--- ESTA ES LA QUE TE FALTA, LA QUE CIERRA LA CLASE