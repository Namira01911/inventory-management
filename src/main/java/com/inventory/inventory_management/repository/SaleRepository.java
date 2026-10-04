package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

}