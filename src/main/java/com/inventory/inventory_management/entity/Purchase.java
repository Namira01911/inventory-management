package com.inventory.inventory_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer supplierId;

    @Positive(message = "Total amount must be greater than 0")
    private Double totalAmount;

    @jakarta.persistence.Column(name = "purchase_date")
    private java.time.LocalDateTime purchaseDate;

    private String status;

    public Purchase() {
        this.purchaseDate = java.time.LocalDateTime.now();
        this.status = "RECEIVED";
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId) {
        this.supplierId = supplierId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public java.time.LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(java.time.LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}