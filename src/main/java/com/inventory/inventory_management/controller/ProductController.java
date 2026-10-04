package com.inventory.inventory_management.controller;

import com.inventory.inventory_management.entity.Product;
import com.inventory.inventory_management.service.ProductService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
  @GetMapping("/{id}")
public ResponseEntity<?> getProductById(@PathVariable Integer id) {
    Product product = productService.getProductById(id);

    if (product == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(product);
}

@GetMapping("/count")
public long getTotalProducts() {
    return productService.getTotalProducts();
}
    @GetMapping("/low-stock")
public List<Product> getLowStockProducts(@RequestParam Integer threshold) {
    return productService.getLowStockProducts(threshold);
}

@GetMapping("/stock")
public long getTotalStock() {
    return productService.getTotalStock();
}

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }
    @PutMapping("/{id}")
public Product updateProduct(@PathVariable Integer id, @RequestBody Product product) {
    return productService.updateProduct(id, product);
}
@DeleteMapping("/{id}")
public void deleteProduct(@PathVariable Integer id) {
    productService.deleteProduct(id);
}
}