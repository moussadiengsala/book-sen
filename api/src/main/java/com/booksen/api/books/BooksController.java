package com.booksen.api.books;


import com.booksen.api.dto.books.BookFilter;
import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
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
@RequestMapping("/api/v1/books")
@Slf4j
public class BooksController {
    private final BooksService booksService;

    @GetMapping("/{id}")
    public ResponseEntity<Response<BookResponseDTO>> getSubscriptionById(@PathVariable String id) {
        Response<BookResponseDTO> response = booksService.getById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping
    public ResponseEntity<Response<List<BookResponseDTO>>> getAllBooks() {
        Response<List<BookResponseDTO>> response = booksService.getAll();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/by-categories")
    public ResponseEntity<Response<List<BookResponseDTO>>> getBooksByCategories(@RequestBody List<String> categories) {
        Response<List<BookResponseDTO>> response = booksService.getByCategories(categories);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/by-authors")
    public ResponseEntity<Response<List<BookResponseDTO>>> getByAuthors(@RequestParam List<String> authors) {
        Response<List<BookResponseDTO>> response = booksService.getByAuthors(authors);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Response<List<BookResponseDTO>>> searchBooks(
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> authors,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAfter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdBefore
    ) {
        BookFilter filter = BookFilter.builder()
                .categories(categories)
                .authors(authors)
                .createdAfter(createdAfter)
                .createdBefore(createdBefore)
                .build();

        Response<List<BookResponseDTO>> response = booksService.searchBooks(filter);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping
    public ResponseEntity<Response<List<BookResponseDTO>>> createBooks(@RequestBody List<CreateUpdateBookDTO> books) {
        Response<List<BookResponseDTO>> response = booksService.create(books);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<BookResponseDTO>> updateBooks(
            @PathVariable String id,
            @RequestBody CreateUpdateBookDTO updateDTO) {
        Response<BookResponseDTO> response = booksService.update(id, updateDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Object>> deleteBooks(@PathVariable String id) {
        Response<Object> response = booksService.delete(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}