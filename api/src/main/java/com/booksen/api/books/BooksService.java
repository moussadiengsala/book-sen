package com.booksen.api.books;

import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
import com.booksen.api.helpers.BooksHelper;
import com.booksen.api.helpers.FileServices;
import com.booksen.api.model.ResourceNotFoundException;
import com.booksen.api.model.Response;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BooksService {
    private final BooksRepository booksRepository;
    private final BooksHelper booksHelper;
    private final Validator validator;
    private final FileServices fileServices;

    public BooksService(BooksRepository booksRepository, BooksHelper booksHelper, Validator validator, FileServices fileServices) {
        this.booksRepository = booksRepository;
        this.booksHelper = booksHelper;
        this.validator = validator;
        this.fileServices = fileServices;
    }

    public Response<BookResponseDTO> getById(String id) {
        Optional<Books> entity = booksRepository.findById(id);
        return entity
                .map(e -> new Response<>(HttpStatus.OK.value(), booksHelper.toResponseEntity(e), "Book found successfully"))
                .orElseGet(() -> new Response<>(HttpStatus.NOT_FOUND.value(), null, "Book not found successfully"));
    }

    public Response<List<BookResponseDTO>> getAll() {
        List<BookResponseDTO> entities = booksRepository.findAll().stream()
                .map(booksHelper::toResponseEntity)
                .collect(Collectors.toList());

        return new Response<>(HttpStatus.OK.value(), entities,
                entities.isEmpty() ? "No Books found" : "Books retrieved successfully");
    }

    public Response<Object> getBookCover(String filename) {
        return fileServices.getImage(filename);
    }

    @Transactional
    public Response<Object> create(CreateUpdateBookDTO book) {

        try {

            Response<Object> buildUserResponse = booksHelper.createBookValidation(book);
            if (buildUserResponse != null && buildUserResponse.getStatus() != HttpStatus.OK.value()) {return buildUserResponse;}

            String cover = buildUserResponse != null ? (String) buildUserResponse.getData() : null;

            Books savedEntity = booksRepository.save(booksHelper.toEntity(book, cover));
            return new Response<>(HttpStatus.CREATED.value(), savedEntity, "Created %d Books successfully");
        } catch (Exception e) {
            log.error("Error creating {}: Books", e.getMessage(), e);
            return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null, String.format("Error creating Books: %s", e.getMessage()));
        }
    }

    @Transactional
    public Response<Object> update(String id, CreateUpdateBookDTO updateDTO) {
        log.info("Updating Books with ID: {}", id);
        booksHelper.prepareForValidation(updateDTO);

        Books entity = booksRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Books with ID {} not found", id);
                    return new ResourceNotFoundException("Books not found");
                });

        Response<Object> existingNameResponse = booksHelper.findExistingNameOnUpdate(id, updateDTO);
        if (existingNameResponse != null) {
            log.warn("Duplicate name found while updating Books: {}", existingNameResponse.getMessage());
            return new Response<>(existingNameResponse.getStatus(), null, existingNameResponse.getMessage());
        }
        Response<Object> updateResponse = booksHelper.updateEntity(entity, updateDTO);
        if (updateResponse != null) {
            return updateResponse;
        }

        Set<ConstraintViolation<Books>> violations = validator.validate(entity);
        if (!violations.isEmpty()) {
            log.warn("Validation errors while updating Books: {}", violations);
            throw new ConstraintViolationException(violations);
        }

        try {
            Books updatedEntity = booksRepository.save(entity);
            log.info("Successfully updated Books with ID: {}", id);
            return new Response<>(HttpStatus.OK.value(), booksHelper.toResponseEntity(updatedEntity), String.format("Books updated successfully"));
        } catch (Exception e) {
            log.error("Error updating Books: {}", e.getMessage(), e);
            return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null, String.format("Error updating Books: %s", e.getMessage()));
        }
    }

    @Transactional
    public Response<Object> delete(String id) {
        log.info("Deleting Books with ID: {}", id);
        Books entity = booksRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("{} with ID Books not found", id);
                    return new ResourceNotFoundException(String.format("Books not found"));
                });

        try {
            booksRepository.deleteById(id);
            log.info("Successfully deleted Books with ID: {}", id);
            return new Response<>(HttpStatus.OK.value(), entity, String.format("BOOKS deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting Books: {}", e.getMessage(), e);
            return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null, String.format("Error deleting Books: %s", e.getMessage()));
        }
    }
}
