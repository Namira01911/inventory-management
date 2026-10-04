package com.inventory.inventory_management.controller;

import com.inventory.inventory_management.service.ProductService;
import com.inventory.inventory_management.service.PurchaseService;
import com.inventory.inventory_management.service.SaleService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/dashboard")
public class DashboardController {

    private final ProductService productService;
    private final PurchaseService purchaseService;
    private final SaleService saleService;

    public DashboardController(ProductService productService,
                                PurchaseService purchaseService,
                                SaleService saleService) {

        this.productService = productService;
        this.purchaseService = purchaseService;
        this.saleService = saleService;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {

        return Map.of(
                "totalProducts", productService.getTotalProducts(),
                "totalStock", productService.getTotalStock(),
                "totalPurchases", purchaseService.getTotalPurchases(),
                "totalPurchaseAmount", purchaseService.getTotalPurchaseAmount(),
                "totalSales", saleService.getTotalSales(),
                "totalSalesAmount", saleService.getTotalSalesAmount()
        );
    }
}