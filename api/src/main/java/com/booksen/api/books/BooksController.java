package com.booksen.api.books;


import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
import com.booksen.api.model.Response;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping("/cover/{filename}")
    public ResponseEntity<Object> getCoverBook(@PathVariable String filename) {
        Response<Object> response = booksService.getBookCover(filename);
        System.out.println(response);
        if (response.getStatus() != HttpStatus.OK.value()) {
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        Resource resource = (Resource) response.getData();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        headers.setContentDispositionFormData("inline", resource.getFilename());

        return ResponseEntity.status(response.getStatus()).headers(headers).body(resource);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<Object>> createBooks(@Valid @ModelAttribute CreateUpdateBookDTO books) {
        Response<Object> response = booksService.create(books);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<Object>> updateBooks(
            @PathVariable String id,
            @ModelAttribute CreateUpdateBookDTO updateDTO) {
        Response<Object> response = booksService.update(id, updateDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Object>> deleteBooks(@PathVariable String id) {
        Response<Object> response = booksService.delete(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}