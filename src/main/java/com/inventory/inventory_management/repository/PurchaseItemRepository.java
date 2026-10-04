package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.entity.PurchaseItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Integer> {

}