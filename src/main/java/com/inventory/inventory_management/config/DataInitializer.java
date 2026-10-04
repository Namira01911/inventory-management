package com.inventory.inventory_management.config;

import com.inventory.inventory_management.entity.Role;
import com.inventory.inventory_management.entity.User;
import com.inventory.inventory_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed initial SELLER account if not already present
        if (!userRepository.existsByEmail("seller@inventory.com")) {
            User seller = new User(
                    "Store Seller",
                    "seller@inventory.com",
                    passwordEncoder.encode("Seller@123"),
                    Role.SELLER
            );
            userRepository.save(seller);
        }

        // Seed initial BUYER account if not already present
        if (!userRepository.existsByEmail("buyer@inventory.com")) {
            User buyer = new User(
                    "Inventory Buyer",
                    "buyer@inventory.com",
                    passwordEncoder.encode("Buyer@123"),
                    Role.BUYER
            );
            userRepository.save(buyer);
        }

        // Seed initial demo CUSTOMER account if not already present
        if (!userRepository.existsByEmail("customer@inventory.com")) {
            User customer = new User(
                    "Demo Customer",
                    "customer@inventory.com",
                    passwordEncoder.encode("Customer@123"),
                    Role.CUSTOMER
            );
            userRepository.save(customer);
        }
    }
}
