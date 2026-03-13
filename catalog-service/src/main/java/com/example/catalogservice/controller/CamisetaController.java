package com.example.catalogservice.controller;

import com.example.catalogservice.model.Camiseta;
import com.example.catalogservice.repository.CamisetaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog")
@CrossOrigin(origins = "http://localhost:4200")
public class CamisetaController {

    private final CamisetaRepository repository;

    public CamisetaController(CamisetaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/camisetas")
    public List<Camiseta> getAllCamisetas() {
        return repository.findAll();
    }

    @PostMapping("/camisetas")
    public ResponseEntity<?> createCamiseta(@RequestBody Camiseta camiseta) {
        if (camiseta.getStock() == null) camiseta.setStock(0);
        return ResponseEntity.ok(repository.save(camiseta));
    }

    @PutMapping("/camisetas/{id}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable Long id,
            @RequestParam Integer quantity,
            @RequestParam String action) {

        return repository.findById(id).map(camiseta -> {
            int current = (camiseta.getStock() == null) ? 0 : camiseta.getStock();
            if ("descontar".equalsIgnoreCase(action)) {
                camiseta.setStock(current - quantity);
            } else {
                camiseta.setStock(current + quantity);
            }
            repository.save(camiseta);
            return ResponseEntity.ok(camiseta);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/camisetas/{id}/restock-unitario")
    public ResponseEntity<?> restockUnitario(@PathVariable Long id) {
        return repository.findById(id).map(camiseta -> {
            camiseta.setStock((camiseta.getStock() == null ? 0 : camiseta.getStock()) + 1);
            repository.save(camiseta);
            return ResponseEntity.ok("Stock recuperado");
        }).orElse(ResponseEntity.notFound().build());
    }
}