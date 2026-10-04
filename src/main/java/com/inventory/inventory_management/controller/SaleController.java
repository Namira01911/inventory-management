package com.inventory.inventory_management.controller;

import com.inventory.inventory_management.entity.Sale;
import com.inventory.inventory_management.service.SaleService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @PostMapping
public Sale addSale(@Valid @RequestBody Sale sale) {
    return saleService.addSale(sale);
}

@GetMapping("/total")
public Double getTotalSalesAmount() {
    return saleService.getTotalSalesAmount();
}

@GetMapping("/count")
public long getTotalSales() {
    return saleService.getTotalSales();
}
}