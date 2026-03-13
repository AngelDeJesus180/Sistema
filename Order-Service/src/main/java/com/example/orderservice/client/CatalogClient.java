package com.example.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "catalog-service", url = "http://catalog-service:8083/catalog")
public interface CatalogClient {
    @PutMapping("/camisetas/{id}/stock")
    void updateStock(@PathVariable("id") Long id,
                     @RequestParam("quantity") Integer quantity,
                     @RequestParam("action") String action);
}