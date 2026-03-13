package com.example.catalogservice.config;

import com.example.catalogservice.model.Camiseta;
import com.example.catalogservice.repository.CamisetaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(CamisetaRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                String[] colores = {"Negro", "Blanco", "Rojo", "Azul", "Gris"};
                String[] tallas = {"S", "M", "L", "XL"};

                for (int i = 1; i <= 20; i++) {
                    Camiseta c = new Camiseta();
                    c.setColor(colores[i % 5]);
                    c.setTalla(tallas[i % 4]);
                    c.setTipoManga(i % 2 == 0 ? "Larga" : "Corta");
                    c.setPrecio(19.99 + i);
                    repository.save(c);
                }
                System.out.println(">>> Base de Datos de Catálogo lista con 20 camisetas.");
            }
        };
    }
}