package com.example.orderservice.service; // Esto ya lo debes tener

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // Asegúrate de que esta línea esté

@Service  // <--- ESTO es lo que debes poner justo aquí, arriba de "public class"
public class OrderPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void enviarOrden(String mensaje) {
        rabbitTemplate.convertAndSend("catalog_queue", mensaje);
    }
}