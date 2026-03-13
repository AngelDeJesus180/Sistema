package com.example.catalogservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // <--- Obliga a usar el archivo application-test.properties
class CatalogServiceApplicationTests {

    @Test
    void contextLoads() {
        // Verifica que la aplicación inicie correctamente con la BD de prueba
    }
}