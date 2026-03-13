package com.example.catalogservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "camisetas")
public class Camiseta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String talla;
    private String color;
    private String tipoManga;
    private Double precio;
    private Integer stock;

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    // Constructor
    public Camiseta() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getTipoManga() { return tipoManga; }
    public void setTipoManga(String tipoManga) { this.tipoManga = tipoManga; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
}


