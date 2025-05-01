package com.booksen.api.dto.books;

import com.booksen.api.category.Category;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUpdateBookDTO {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotBlank(message = "Author is required")
    private String author;

    @NotNull(message = "Category ID is required")
    private Category category;

    @NotNull(message = "Cover image is required")
    private MultipartFile cover;
}
