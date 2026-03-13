package com.example.apigateway2.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.util.UUID;

@Component
public class CorrelationFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1. Buscamos si ya viene un ID en la cabecera
        String correlationId = exchange.getRequest().getHeaders().getFirst("X-Correlation-Id");

        // 2. Si no existe, lo creamos (es un código único como 'a1b2-c3d4...')
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }

        // 3. Lo pegamos en la respuesta para que el Front (Angular) pueda verlo si hay error
        exchange.getResponse().getHeaders().add("X-Correlation-Id", correlationId);

        // 4. Continuamos el camino
        return chain.filter(exchange);
    }
}