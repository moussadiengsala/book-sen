package com.booksen.api.category;

import com.booksen.api.books.Books;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByNameIn(Set<String> namesToCheck);
    Optional<Category> findByName(@NotBlank(message = "Name is required") @Size(max = 100, message = "Name must not exceed 100 characters") String name);
}
