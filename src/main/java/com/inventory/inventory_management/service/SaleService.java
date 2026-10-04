package com.inventory.inventory_management.service;

import com.inventory.inventory_management.entity.Sale;
import com.inventory.inventory_management.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale addSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public Double getTotalSalesAmount() {
    return saleRepository.findAll()
            .stream()
            .mapToDouble(Sale::getTotalAmount)
            .sum();
}
public long getTotalSales() {
    return saleRepository.count();
}
}