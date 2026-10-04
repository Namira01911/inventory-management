package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

}