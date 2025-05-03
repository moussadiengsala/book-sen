package com.booksen.api.helpers;

import com.booksen.api.books.Books;
import com.booksen.api.books.BooksRepository;
import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
import com.booksen.api.dto.user.CreateUserDTO;
import com.booksen.api.model.Response;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BooksHelper {

    private final BooksRepository booksRepository;
    private final FileServices fileServices;

    public void prepareForValidation(CreateUpdateBookDTO dto) {
        Optional.ofNullable(dto.getName())
                .ifPresent(name -> dto.setName(name.toLowerCase()));
    }

    public Response<Object> createBookValidation(CreateUpdateBookDTO dto) {
        prepareForValidation(dto);
        if (booksRepository.findBooksByName(dto.getName()).isPresent()) return Response.badRequest("Book already exists.");
        return this.processCover(dto.getCover());
    }

    public Set<String> findExistingNames(List<CreateUpdateBookDTO> dtos) {
        Set<String> namesToCheck = dtos.stream()
                .map(CreateUpdateBookDTO::getName)
                .collect(Collectors.toSet());

        return booksRepository.findByNameIn(namesToCheck).stream()
                .map(Books::getName)
                .collect(Collectors.toSet());
    }

    public BookResponseDTO toResponseEntity(Books book) {
        return BookResponseDTO.builder()
                .id(book.getId())
                .name(book.getName())
                .description(book.getDescription())
                .author(book.getAuthor())
                .cover(book.getCover())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }

    public Books toEntity(CreateUpdateBookDTO dto, String cover) {
        return Books.builder()
                .name(dto.getName())
                .author(dto.getAuthor())
                .description(dto.getDescription())
                .cover(cover)
                .updatedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public Response<Object> findExistingNameOnUpdate(String id, CreateUpdateBookDTO dto) {
        Optional<Books> entityWithSameName = booksRepository.findByName(dto.getName());
        if (entityWithSameName.isPresent() && !entityWithSameName.get().getId().equals(id)) {
            return new Response<>(HttpStatus.CONFLICT.value(), null,
                    "Another entity with this name already exists");
        }
        return null;
    }

    public Response<Object> updateEntity(Books entity, CreateUpdateBookDTO updateDTO) {
        boolean isUpdated = false;

        if (updateDTO.getName() != null) {
            entity.setName(updateDTO.getName());
            isUpdated = true;
        }

        if (updateDTO.getDescription() != null) {
            entity.setDescription(updateDTO.getDescription());
            isUpdated = true;
        }


        if (updateDTO.getCover() != null) {
            Response<Object> response = this.processCover(updateDTO.getCover());
            if (response.getStatus() != HttpStatus.OK.value()) return response;
            try {

                if (entity.getCover() != null) {
                    Response<Object> responseDeleted = fileServices.deleteOldImage(entity.getCover());
                    if (responseDeleted != null) return responseDeleted;
                }

                // Set the new avatar URL
                String avatarUrl = (String) response.getData();
                entity.setCover(avatarUrl);
            } catch (IOException e) {
                return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to process avatar", null);
            }
        }

        if (!isUpdated) {
            return Response.badRequest("You need to provide data to update the book");
        }

        entity.setUpdatedAt(LocalDateTime.now());
        return null;
    }

    private Response<Object> processCover(MultipartFile cover) {
        if (cover == null || cover.isEmpty()) return null;

        try {
            Response<Object> fileValidationResponse = fileServices.validateFile(cover);
            if (fileValidationResponse != null) {
                return fileValidationResponse;
            }

            return new Response<Object>(HttpStatus.OK.value(), fileServices.saveFile(cover), "");
        } catch (Exception e) {
            return Response.<Object>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
        }
    }
}
