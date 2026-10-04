package com.inventory.inventory_management.service;

import com.inventory.inventory_management.entity.SaleItem;
import com.inventory.inventory_management.entity.Product;
import com.inventory.inventory_management.repository.SaleItemRepository;
import com.inventory.inventory_management.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import com.inventory.inventory_management.entity.Sale;
import com.inventory.inventory_management.repository.SaleRepository;

@Service
public class SaleItemService {

    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    public SaleItemService(SaleItemRepository saleItemRepository,
                       ProductRepository productRepository,
                       SaleRepository saleRepository) {

    this.saleItemRepository = saleItemRepository;
    this.productRepository = productRepository;
    this.saleRepository = saleRepository;
}

    public List<SaleItem> getAllSaleItems() {
        return saleItemRepository.findAll();
    }

    public SaleItem addSaleItem(SaleItem saleItem) {

    Sale sale = saleRepository
            .findById(saleItem.getSaleId())
            .orElse(null);

    if (sale == null) {
        throw new RuntimeException("Sale not found");
    }

    Product product = productRepository
            .findById(saleItem.getProductId())
            .orElse(null);

    if (product == null) {
        throw new RuntimeException("Product not found");
    }

    if (saleItem.getQuantity() > product.getQuantity()) {
        throw new RuntimeException("Not enough stock available");
    }

    product.setQuantity(product.getQuantity() - saleItem.getQuantity());
    productRepository.save(product);

    return saleItemRepository.save(saleItem);
}
}