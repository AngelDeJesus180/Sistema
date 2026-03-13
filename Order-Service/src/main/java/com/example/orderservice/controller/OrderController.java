package com.example.orderservice.controller;

import com.example.orderservice.model.Order;
import com.example.orderservice.service.OrderService;
import com.example.orderservice.service.OrderPublisher;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;
    private final OrderPublisher orderPublisher;
    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public OrderController(OrderService service, OrderPublisher orderPublisher,
                           OrderRepository orderRepository, RestTemplate restTemplate) {
        this.service = service;
        this.orderPublisher = orderPublisher;
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    // Admin: todos los pedidos
    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    // Usuario: solo sus pedidos
    @GetMapping("/user/{username}")
    public List<Order> getByUser(@PathVariable String username) {
        return orderRepository.findByUsername(username);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Order order) {
        try {
            Order nuevoPedido = service.createOrder(order);
            orderPublisher.enviarOrden("NUEVA ORDEN - Producto ID: " + nuevoPedido.getProductId());
            return ResponseEntity.ok(nuevoPedido);
        } catch (Exception e) {
            return ResponseEntity.status(409).body("Error: Stock insuficiente o problema de conexión.");
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id) {
        return orderRepository.findById(id).map(pedido -> {
            if ("CANCELLED".equalsIgnoreCase(pedido.getStatus())) {
                return ResponseEntity.badRequest().body("El pedido ya se encuentra cancelado.");
            }
            pedido.setStatus("CANCELLED");
            orderRepository.save(pedido);
            String catalogUrl = "http://catalog-service:8083/catalog/camisetas/" + pedido.getProductId() + "/restock-unitario";
            try {
                restTemplate.put(catalogUrl, null);
                orderPublisher.enviarOrden("ORDEN CANCELADA - Producto ID: " + pedido.getProductId());
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error al actualizar stock en catálogo.");
            }
            return ResponseEntity.ok("Pedido #" + id + " cancelado correctamente.");
        }).orElse(ResponseEntity.notFound().build());
    }
}