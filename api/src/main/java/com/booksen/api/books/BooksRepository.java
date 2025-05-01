package com.booksen.api.books;

import jakarta.validation.constraints.NotBlank;
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

    List<Books> findByCategory_NameIn(Collection<String> categoryNames);
    List<Books> findByAuthor(String author);
    List<Books> findByAuthorIn(Collection<String> authors);

    // Custom query for multiple filters
    @Query("SELECT b FROM Books b WHERE " +
            "(:categoryNames IS NULL OR b.category.name IN :categoryNames) AND " +
            "(:authors IS NULL OR b.author IN :authors) AND " +
            "(:minDate IS NULL OR b.createdAt >= :minDate) AND " +
            "(:maxDate IS NULL OR b.createdAt <= :maxDate)")
    List<Books> findByFilters(
            @Param("categoryNames") Collection<String> categoryNames,
            @Param("authors") Collection<String> authors,
            @Param("minDate") LocalDateTime minDate,
            @Param("maxDate") LocalDateTime maxDate
    );
}