package com.inventory.inventory_management.service;

import com.inventory.inventory_management.dto.CreateOrderRequest;
import com.inventory.inventory_management.dto.OrderItemDto;
import com.inventory.inventory_management.dto.OrderResponse;
import com.inventory.inventory_management.entity.*;
import com.inventory.inventory_management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        SaleRepository saleRepository,
                        SaleItemRepository saleItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, Integer customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + customerId));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Validate stock and compute total
        double totalAmount = 0.0;
        List<OrderItem> itemsToSave = new ArrayList<>();

        for (OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemDto.getProductId()));

            int availableStock = product.getQuantity() != null ? product.getQuantity() : 0;
            if (itemDto.getQuantity() > availableStock) {
                throw new IllegalArgumentException("Insufficient stock for product '" + product.getName() + "'. Available: " + availableStock + ", Requested: " + itemDto.getQuantity());
            }

            double price = product.getPrice() != null ? product.getPrice() : 0.0;
            double subtotal = price * itemDto.getQuantity();
            totalAmount += subtotal;

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(price);
            orderItem.setSubtotal(subtotal);
            itemsToSave.add(orderItem);
        }

        Order order = new Order();
        order.setCustomerId(customer.getId());
        order.setCustomerName(customer.getName());
        order.setCustomerEmail(customer.getEmail());
        order.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
        order.setStatus(OrderStatus.PENDING);
        order.setNotes(request.getNotes());
        order.setOrderDate(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : itemsToSave) {
            item.setOrderId(savedOrder.getId());
            orderItemRepository.save(item);
        }

        return new OrderResponse(savedOrder, itemsToSave);
    }

    public List<OrderResponse> getCustomerOrders(Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            responses.add(new OrderResponse(order, items));
        }
        return responses;
    }

    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders = (status != null)
                ? orderRepository.findByStatusOrderByOrderDateDesc(status)
                : orderRepository.findAllByOrderByOrderDateDesc();

        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            responses.add(new OrderResponse(order, items));
        }
        return responses;
    }

    public OrderResponse getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        return new OrderResponse(order, items);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Integer orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new IllegalStateException("Order #" + orderId + " is already COMPLETED and cannot be changed");
        }
        if (order.getStatus() == OrderStatus.REJECTED) {
            throw new IllegalStateException("Order #" + orderId + " was REJECTED and cannot be changed");
        }

        if (newStatus == OrderStatus.COMPLETED) {
            return completeOrder(orderId);
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        Order updated = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrderId(updated.getId());
        return new OrderResponse(updated, items);
    }

    @Transactional(rollbackFor = Exception.class)
    public OrderResponse completeOrder(Integer orderId) {
        // 1. Verify the order exists
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // 2. Verify the order is not already COMPLETED or REJECTED
        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new IllegalStateException("Order #" + orderId + " is already COMPLETED");
        }
        if (order.getStatus() == OrderStatus.REJECTED) {
            throw new IllegalStateException("Order #" + orderId + " was REJECTED and cannot be completed");
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        if (items.isEmpty()) {
            throw new IllegalStateException("Order #" + orderId + " has no items to process");
        }

        // 3. Verify sufficient stock exists for ALL items before deducting anything
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + item.getProductId()));

            int currentStock = product.getQuantity() != null ? product.getQuantity() : 0;
            if (item.getQuantity() > currentStock) {
                throw new IllegalStateException("Cannot complete order: Insufficient stock for product '"
                        + product.getName() + "'. Available: " + currentStock + ", Required: " + item.getQuantity());
            }
        }

        // 4. Deduct stock exactly once for each product
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProductId()).get();
            int newQuantity = product.getQuantity() - item.getQuantity();
            product.setQuantity(newQuantity);
            productRepository.save(product);
        }

        // 5. Create Sale and SaleItem records exactly once to preserve sales ledger & reporting
        Sale sale = new Sale();
        sale.setCustomerName(order.getCustomerName());
        sale.setTotalAmount(order.getTotalAmount());
        sale.setSaleDate(LocalDateTime.now());
        Sale savedSale = saleRepository.save(sale);

        for (OrderItem item : items) {
            SaleItem saleItem = new SaleItem();
            saleItem.setSaleId(savedSale.getId());
            saleItem.setProductId(item.getProductId());
            saleItem.setQuantity(item.getQuantity());
            saleItem.setPrice(item.getPrice());
            saleItemRepository.save(saleItem);
        }

        // 6. Set order status to COMPLETED
        order.setStatus(OrderStatus.COMPLETED);
        order.setUpdatedAt(LocalDateTime.now());
        Order completedOrder = orderRepository.save(order);

        return new OrderResponse(completedOrder, items);
    }
}
