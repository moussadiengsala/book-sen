package com.booksen.api.books;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface BooksRepository extends MongoRepository<Books, String> {
    List<Books> findByNameIn(Set<String> namesToCheck);
    Optional<Books> findByName(@NotBlank(message = "Name is required") @Size(max = 100, message = "Name must not exceed 100 characters") String name);

    List<Books> findByAuthor(String author);
    List<Books> findByAuthorIn(Collection<String> authors);

    @Query(value = "{" +
            "'author': { $in: ?0 }," +
            "'createdAt': { $gte: ?1, $lte: ?2 }" +
            "}")
    List<Books> findByFilters(
            @Param("authors") Collection<String> authors,
            @Param("minDate") LocalDateTime minDate,
            @Param("maxDate") LocalDateTime maxDate
    );

    Optional<Books> findBooksByName(@NotBlank(message = "Name is required") @Size(min = 2, max = 20, message = "Name must be between 2 and 20 characters") @Pattern(
            regexp = "^[A-Za-zÀ-ÿ\\s'-]+$",
            message = "Name can only contain letters, spaces, hyphens, and apostrophes"
    ) String name);
}