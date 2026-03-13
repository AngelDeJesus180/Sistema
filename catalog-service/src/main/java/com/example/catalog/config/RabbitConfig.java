package com.example.catalog.config; // <-- ASEGÚRATE de que esto coincida con tu ruta

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // Este nombre es el que verás en el panel naranja (Queues)
    public static final String QUEUE_NAME = "catalog_queue";

    @Bean
    public Queue catalogQueue() {
        // El parámetro true indica que la cola es "durable" (no se borra si cae el servidor)
        return new Queue(QUEUE_NAME, true);
    }
}