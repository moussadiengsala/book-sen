package com.booksen.api.dto.books;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUpdateBookDTO {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 20, message = "Name must be between 2 and 20 characters")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ\\s'-]+$",
            message = "Name can only contain letters, spaces, hyphens, and apostrophes"
    )
    private String name;

    @NotBlank(message = "Description is required and cannot be empty")
    @Size(min = 10, max = 255, message = "Description must be between 10 and 255 characters long")
    private String description;

    @NotBlank(message = "Author is required")
    @Size(min = 2, max = 50, message = "Author must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ\\s'-]+$",
            message = "Author can only contain letters, spaces, hyphens, and apostrophes"
    )
    private String author;

    @NotNull(message = "Cover image is required")
    private MultipartFile cover;
}
