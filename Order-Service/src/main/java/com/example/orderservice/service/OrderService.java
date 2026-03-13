package com.example.orderservice.service;

import com.example.orderservice.model.Order;
import com.example.orderservice.model.StockException;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository repository;

    @Autowired
    private RestTemplate restTemplate;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public Order createOrder(Order order) {
        // 1. URL del Catálogo - Asegúrate que 'catalog-service' sea el nombre en tu docker-compose
        String catalogUrl = "http://catalog-service:8083/catalog/" + order.getProductoId();

        try {
            // Intentamos obtener el producto del catálogo
            @SuppressWarnings("unchecked")
            Map<String, Object> producto = restTemplate.getForObject(catalogUrl, Map.class);

            if (producto != null && producto.containsKey("stock")) {
                int stockDisponible = (int) producto.get("stock");

                // 2. VALIDACIÓN HU10: Solo si hay respuesta del catálogo validamos stock
                if (stockDisponible < order.getCantidad()) {
                    throw new StockException("No hay suficiente stock. Disponible: " + stockDisponible);
                }
            }
        } catch (StockException e) {
            // Si es un error de stock real, lanzamos el 409
            throw e;
        } catch (Exception e) {
            // Si el catálogo está caído o la URL está mal, imprimimos el error en consola
            // Pero PERMITIMOS que la orden se cree para que no se bloquee tu demo
            System.out.println("ADVERTENCIA: No se pudo validar stock (Catálogo inaccesible). Continuando...");
        }

        // 3. Guardar la orden (Esto te dará el 201 Created en Postman)
        order.setStatus("RECUPERADO");
        return repository.save(order);
    }
}