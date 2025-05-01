package com.booksen.api.helpers;

import com.booksen.api.books.Books;
import com.booksen.api.books.BooksRepository;
import com.booksen.api.category.CategoryRepository;
import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
import com.booksen.api.model.EntityHelper;
import com.booksen.api.model.ResourceNotFoundException;
import com.booksen.api.model.Response;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BooksHelper implements EntityHelper<Books, String, CreateUpdateBookDTO, BookResponseDTO> {

    private final BooksRepository booksRepository;
    private final CategoryRepository categoryRepository;
    private final Validator validator;

    @Override
    public void prepareForValidation(CreateUpdateBookDTO dto) {
        Optional.ofNullable(dto.getName())
                .ifPresent(name -> dto.setName(name.toLowerCase()));
    }

    @Override
    public Map<Integer, List<String>> validate(List<CreateUpdateBookDTO> dtos) {
        Map<Integer, List<String>> errors = new HashMap<>();

        for (int i = 0; i < dtos.size(); i++) {
            CreateUpdateBookDTO dto = dtos.get(i);
            List<String> errorMessages = new ArrayList<>();

            // Validate categories existence
            if (dto.getCategory() != null) {
                if (!categoryRepository.existsById(dto.getCategory().getId())) {
                    errorMessages.add("Category with ID " + dto.getCategory().getId() + " does not exist");
                }
            }

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
    public Set<String> findExistingNames(List<CreateUpdateBookDTO> dtos) {
        Set<String> namesToCheck = dtos.stream()
                .map(CreateUpdateBookDTO::getName)
                .collect(Collectors.toSet());

        return booksRepository.findByNameIn(namesToCheck).stream()
                .map(Books::getName)
                .collect(Collectors.toSet());
    }

    @Override
    public BookResponseDTO toResponseEntity(Books book) {
        return BookResponseDTO.builder()
                .id(book.getId())
                .name(book.getName())
                .description(book.getDescription())
                .author(book.getAuthor())
                .coverUrl(book.getCover()) // Or generate full URL if needed
                .categoryName(book.getCategory().getName())
                .category(book.getCategory())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }

    @Override
    public Books toEntity(CreateUpdateBookDTO dto) {
        return Books.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    @Override
    public Response<Object> findExistingNameOnUpdate(String id, CreateUpdateBookDTO dto) {
        Optional<Books> entityWithSameName = booksRepository.findByName(dto.getName());
        if (entityWithSameName.isPresent() && !entityWithSameName.get().getId().equals(id)) {
            return new Response<>(HttpStatus.CONFLICT.value(), null,
                    "Another entity with this name already exists");
        }
        return null;
    }

    @Override
    public void updateEntity(Books entity, CreateUpdateBookDTO updateDTO) {
        Optional.ofNullable(updateDTO.getName()).ifPresent(entity::setName);
        Optional.ofNullable(updateDTO.getDescription()).ifPresent(entity::setDescription);

        Optional.ofNullable(updateDTO.getCategory()).ifPresent(category -> {
            categoryRepository.findById(category.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + category.getName()))
                    .getId();
            entity.setCategory(category);
        });

        entity.setUpdatedAt(LocalDateTime.now()); // Update timestamp
    }
}
