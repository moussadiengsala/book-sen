package com.booksen.api.dto.books;

import com.booksen.api.category.Category;
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
    private String coverUrl; // Public URL or file path to the uploaded cover
    private String categoryName;
    private Category category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}