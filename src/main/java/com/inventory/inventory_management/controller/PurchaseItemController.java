package com.inventory.inventory_management.controller;

import com.inventory.inventory_management.entity.PurchaseItem;
import com.inventory.inventory_management.service.PurchaseItemService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/purchase-items")
public class PurchaseItemController {

    private final PurchaseItemService purchaseItemService;

    public PurchaseItemController(PurchaseItemService purchaseItemService) {
        this.purchaseItemService = purchaseItemService;
    }

    @GetMapping
    public List<PurchaseItem> getAllPurchaseItems() {
        return purchaseItemService.getAllPurchaseItems();
    }

    @PostMapping
    public ResponseEntity<?> addPurchaseItem(
            @Valid @RequestBody PurchaseItem purchaseItem) {

        try {
            return ResponseEntity.ok(
                    purchaseItemService.addPurchaseItem(purchaseItem)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}