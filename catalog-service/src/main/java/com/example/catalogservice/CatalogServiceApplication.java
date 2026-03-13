package com.example.catalogservice;

import org.springframework.amqp.rabbit.annotation.EnableRabbit; // Agregamos esta importación
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableRabbit // Esto le dice a Spring que busque conexiones de RabbitMQ
public class CatalogServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CatalogServiceApplication.class, args);
    }
}