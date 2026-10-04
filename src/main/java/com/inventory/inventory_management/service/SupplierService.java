package com.inventory.inventory_management.service;

import com.inventory.inventory_management.entity.Supplier;
import com.inventory.inventory_management.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }
    public Supplier updateSupplier(Integer id, Supplier supplier) {
    Supplier existingSupplier = supplierRepository.findById(id).orElse(null);

    if (existingSupplier == null) {
        return null;
    }

    existingSupplier.setName(supplier.getName());
    existingSupplier.setEmail(supplier.getEmail());
    existingSupplier.setPhone(supplier.getPhone());
    existingSupplier.setAddress(supplier.getAddress());

    return supplierRepository.save(existingSupplier);
}
public void deleteSupplier(Integer id) {
    supplierRepository.deleteById(id);
}
}