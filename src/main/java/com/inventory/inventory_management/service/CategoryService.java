package com.inventory.inventory_management.service;

import com.inventory.inventory_management.entity.Category;
import com.inventory.inventory_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }
    public Category updateCategory(Integer id, Category category) {
    Category existingCategory = categoryRepository.findById(id).orElse(null);

    if (existingCategory == null) {
        return null;
    }

    existingCategory.setName(category.getName());

    return categoryRepository.save(existingCategory);
}
public void deleteCategory(Integer id) {
    categoryRepository.deleteById(id);
}
}