package com.inventory.inventory_management.controller;

import com.inventory.inventory_management.entity.SaleItem;
import com.inventory.inventory_management.service.SaleItemService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/sale-items")
public class SaleItemController {

    private final SaleItemService saleItemService;

    public SaleItemController(SaleItemService saleItemService) {
        this.saleItemService = saleItemService;
    }

    @GetMapping
    public List<SaleItem> getAllSaleItems() {
        return saleItemService.getAllSaleItems();
    }

    @PostMapping
    public ResponseEntity<?> addSaleItem(@Valid @RequestBody SaleItem saleItem) {
        try {
            return ResponseEntity.ok(saleItemService.addSaleItem(saleItem));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}