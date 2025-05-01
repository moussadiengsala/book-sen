package com.booksen.api.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CreateUpdateCategoryDTO {
    @NotBlank(message = "Category name is mandatory")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Logo URL is mandatory")
    @Pattern(regexp = "^(https?|ftp)://.*$", message = "Invalid logo URL")
    private String icon;
}