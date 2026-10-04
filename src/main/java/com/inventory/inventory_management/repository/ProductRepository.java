package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByQuantityLessThanEqual(Integer quantity);

}