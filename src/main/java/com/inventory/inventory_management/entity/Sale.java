package com.inventory.inventory_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @Positive(message = "Total amount must be greater than 0")
    private Double totalAmount;

    @jakarta.persistence.Column(name = "sale_date")
    private java.time.LocalDateTime saleDate;

    public Sale() {
        this.saleDate = java.time.LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public java.time.LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(java.time.LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }
}