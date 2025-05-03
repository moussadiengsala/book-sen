package com.booksen.api.dto.books;

import lombok.*;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponseDTO {
    private String id;
    private String name;
    private String description;
    private String author;
    private String cover;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}