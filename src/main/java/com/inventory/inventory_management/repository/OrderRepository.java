package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.entity.Order;
import com.inventory.inventory_management.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerIdOrderByOrderDateDesc(Integer customerId);
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findByStatusOrderByOrderDateDesc(OrderStatus status);
    long countByStatus(OrderStatus status);
}
