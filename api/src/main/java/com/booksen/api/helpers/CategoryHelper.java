package com.booksen.api.helpers;


import com.booksen.api.books.Books;
import com.booksen.api.books.BooksRepository;
import com.booksen.api.category.Category;
import com.booksen.api.category.CategoryRepository;
import com.booksen.api.category.CategoryService;
import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
import com.booksen.api.dto.category.CategoryResponseDTO;
import com.booksen.api.dto.category.CreateUpdateCategoryDTO;
import com.booksen.api.model.EntityHelper;
import com.booksen.api.model.ResourceNotFoundException;
import com.booksen.api.model.Response;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CategoryHelper implements EntityHelper<Category, String, CreateUpdateCategoryDTO, CategoryResponseDTO> {

    private final CategoryRepository categoryRepository;
    private final Validator validator;

    @Override
    public void prepareForValidation(CreateUpdateCategoryDTO dto) {
        Optional.ofNullable(dto.getName())
                .ifPresent(name -> dto.setName(name.toLowerCase()));
    }

    @Override
    public Map<Integer, List<String>> validate(List<CreateUpdateCategoryDTO> dtos) {
        Map<Integer, List<String>> errors = new HashMap<>();

        for (int i = 0; i < dtos.size(); i++) {
            CreateUpdateCategoryDTO dto = dtos.get(i);
            List<String> errorMessages = new ArrayList<>();

            // Validate constraints (default method)
            Map<Integer, List<String>> validationErrors = validateEntities(dtos, validator);
            if (!validationErrors.isEmpty()) {
                errorMessages.addAll(validationErrors.getOrDefault(i, List.of()));
            }

            if (!errorMessages.isEmpty()) {
                errors.put(i, errorMessages);
            }
        }

        return errors;
    }

    @Override
    public Set<String> findExistingNames(List<CreateUpdateCategoryDTO> dtos) {
        Set<String> namesToCheck = dtos.stream()
                .map(CreateUpdateCategoryDTO::getName)
                .collect(Collectors.toSet());

        return categoryRepository.findByNameIn(namesToCheck).stream()
                .map(Category::getName)
                .collect(Collectors.toSet());
    }

    @Override
    public CategoryResponseDTO toResponseEntity(Category category) {
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .build();
    }

    @Override
    public Category toEntity(CreateUpdateCategoryDTO dto) {
        return Category.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .build();
    }

    @Override
    public Response<Object> findExistingNameOnUpdate(String id, CreateUpdateCategoryDTO dto) {
        Optional<Category> entityWithSameName = categoryRepository.findByName(dto.getName());
        if (entityWithSameName.isPresent() && !entityWithSameName.get().getId().equals(id)) {
            return new Response<>(HttpStatus.CONFLICT.value(), null,
                    "Another entity with this name already exists");
        }
        return null;
    }

    @Override
    public void updateEntity(Category entity, CreateUpdateCategoryDTO updateDTO) {
        Optional.ofNullable(updateDTO.getName()).ifPresent(entity::setName);
    }
}