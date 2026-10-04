package com.inventory.inventory_management.service;

import com.inventory.inventory_management.entity.PurchaseItem;
import com.inventory.inventory_management.entity.Product;
import com.inventory.inventory_management.entity.Purchase;

import com.inventory.inventory_management.repository.PurchaseItemRepository;
import com.inventory.inventory_management.repository.ProductRepository;
import com.inventory.inventory_management.repository.PurchaseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseItemService {

    private final PurchaseItemRepository purchaseItemRepository;
    private final ProductRepository productRepository;
    private final PurchaseRepository purchaseRepository;

    public PurchaseItemService(PurchaseItemRepository purchaseItemRepository,
                               ProductRepository productRepository,
                               PurchaseRepository purchaseRepository) {

        this.purchaseItemRepository = purchaseItemRepository;
        this.productRepository = productRepository;
        this.purchaseRepository = purchaseRepository;
    }

    public List<PurchaseItem> getAllPurchaseItems() {
        return purchaseItemRepository.findAll();
    }

    public PurchaseItem addPurchaseItem(PurchaseItem purchaseItem) {

        Purchase purchase = purchaseRepository
                .findById(purchaseItem.getPurchaseId())
                .orElse(null);

        if (purchase == null) {
            throw new RuntimeException("Purchase not found");
        }

        Product product = productRepository
                .findById(purchaseItem.getProductId())
                .orElse(null);

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        product.setQuantity(product.getQuantity() + purchaseItem.getQuantity());
        productRepository.save(product);

        return purchaseItemRepository.save(purchaseItem);
    }
}