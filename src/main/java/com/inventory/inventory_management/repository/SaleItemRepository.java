package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Integer> {

}