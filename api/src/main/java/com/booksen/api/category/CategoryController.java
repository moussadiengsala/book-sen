package com.booksen.api.category;


import com.booksen.api.dto.books.BookFilter;
import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
import com.booksen.api.dto.category.CategoryResponseDTO;
import com.booksen.api.dto.category.CreateUpdateCategoryDTO;
import com.booksen.api.model.Response;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/category")
@Slf4j
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/{id}")
    public ResponseEntity<Response<CategoryResponseDTO>> getCategoryById(@PathVariable String id) {
        Response<CategoryResponseDTO> response = categoryService.getById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping
    public ResponseEntity<Response<List<CategoryResponseDTO>>> getAllCategories() {
        Response<List<CategoryResponseDTO>> response = categoryService.getAll();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping
    public ResponseEntity<Response<List<CategoryResponseDTO>>> createCategory(@RequestBody List<CreateUpdateCategoryDTO> category) {
        Response<List<CategoryResponseDTO>> response = categoryService.create(category);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<CategoryResponseDTO>> updateCategory(
            @PathVariable String id,
            @RequestBody CreateUpdateCategoryDTO updateDTO) {
        Response<CategoryResponseDTO> response = categoryService.update(id, updateDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Object>> deleteCategory(@PathVariable String id) {
        Response<Object> response = categoryService.delete(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}