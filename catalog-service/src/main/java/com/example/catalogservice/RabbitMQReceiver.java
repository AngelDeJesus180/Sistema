package com.example.catalogservice;

import com.example.catalogservice.model.Camiseta; // Importa tu modelo
import com.example.catalogservice.repository.CamisetaRepository; // Importa tu repo
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQReceiver {

    @Autowired
    private CamisetaRepository repository;

    @RabbitListener(queues = "catalog_queue")
    public void recibirMensaje(String mensaje) {
        System.out.println("-------------------------------------------------");
        System.out.println("¡CONEXIÓN EXITOSA! Procesando ID: " + mensaje);
        System.out.println("-------------------------------------------------");

        try {
            // Limpiamos el mensaje por si trae espacios o comillas
            String idLimpio = mensaje.replaceAll("[^0-9]", "");
            Long productoId = Long.parseLong(idLimpio);

            // Buscamos y actualizamos
            repository.findById(productoId).ifPresent(producto -> {
                producto.setStock(producto.getStock() + 1);
                repository.save(producto);
                System.out.println("LOG: Stock del producto " + productoId + " subió a " + producto.getStock());
            });

        } catch (Exception e) {
            System.err.println("Error: No se pudo procesar el mensaje [" + mensaje + "]");
        }
    }
}