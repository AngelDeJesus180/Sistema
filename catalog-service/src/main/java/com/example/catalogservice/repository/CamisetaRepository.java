package com.example.catalogservice.repository;

import com.example.catalogservice.model.Camiseta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CamisetaRepository extends JpaRepository<Camiseta, Long> {
}