package com.inventory.inventory_management.service;

import com.inventory.inventory_management.entity.Purchase;
import com.inventory.inventory_management.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import com.inventory.inventory_management.entity.Supplier;
import com.inventory.inventory_management.repository.SupplierRepository;

import com.inventory.inventory_management.dto.ReceiveStockRequest;
import com.inventory.inventory_management.entity.Product;
import com.inventory.inventory_management.entity.PurchaseItem;
import com.inventory.inventory_management.repository.ProductRepository;
import com.inventory.inventory_management.repository.PurchaseItemRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PurchaseItemRepository purchaseItemRepository;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           SupplierRepository supplierRepository,
                           ProductRepository productRepository,
                           PurchaseItemRepository purchaseItemRepository) {
        this.purchaseRepository = purchaseRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.purchaseItemRepository = purchaseItemRepository;
    }

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    public Purchase addPurchase(Purchase purchase) {
    Supplier supplier = supplierRepository.findById(purchase.getSupplierId()).orElse(null);

    if (supplier == null) {
        throw new RuntimeException("Supplier not found");
    }

    return purchaseRepository.save(purchase);
}

public Double getTotalPurchaseAmount() {
    return purchaseRepository.findAll()
            .stream()
            .mapToDouble(Purchase::getTotalAmount)
            .sum();
}

public long getTotalPurchases() {
    return purchaseRepository.count();
}

    @Transactional(rollbackFor = Exception.class)
    public Purchase receiveStock(ReceiveStockRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with ID: " + request.getSupplierId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("At least one purchase item is required");
        }

        double totalAmount = 0.0;
        for (ReceiveStockRequest.Item item : request.getItems()) {
            totalAmount += item.getPrice() * item.getQuantity();
        }

        Purchase purchase = new Purchase();
        purchase.setSupplierId(supplier.getId());
        purchase.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
        purchase.setPurchaseDate(LocalDateTime.now());
        purchase.setStatus("RECEIVED");

        Purchase savedPurchase = purchaseRepository.save(purchase);

        for (ReceiveStockRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + item.getProductId()));

            int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
            product.setQuantity(currentQty + item.getQuantity());
            productRepository.save(product);

            PurchaseItem purchaseItem = new PurchaseItem();
            purchaseItem.setPurchaseId(savedPurchase.getId());
            purchaseItem.setProductId(product.getId());
            purchaseItem.setQuantity(item.getQuantity());
            purchaseItem.setPrice(item.getPrice());
            purchaseItemRepository.save(purchaseItem);
        }

        return savedPurchase;
    }
}