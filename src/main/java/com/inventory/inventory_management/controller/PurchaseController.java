package com.inventory.inventory_management.controller;

import com.inventory.inventory_management.entity.Purchase;
import com.inventory.inventory_management.service.PurchaseService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public List<Purchase> getAllPurchases() {
        return purchaseService.getAllPurchases();
    }

    @GetMapping("/total")
    public Double getTotalPurchaseAmount() {
        return purchaseService.getTotalPurchaseAmount();
    }

    @GetMapping("/count")
    public long getTotalPurchases() {
        return purchaseService.getTotalPurchases();
    }

    @PostMapping
    public ResponseEntity<?> addPurchase(
            @Valid @RequestBody Purchase purchase) {

        try {
            return ResponseEntity.ok(
                    purchaseService.addPurchase(purchase)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/receive")
    public ResponseEntity<?> receiveStock(@Valid @RequestBody com.inventory.inventory_management.dto.ReceiveStockRequest request) {
        try {
            return ResponseEntity.ok(purchaseService.receiveStock(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}