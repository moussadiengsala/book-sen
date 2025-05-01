package com.booksen.api.dto.user;

import com.booksen.api.model.Role;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class UpdateUserDTO {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 20, message = "Name must be between 2 and 20 characters")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s'-]+$", message = "Name can only contain letters, spaces, hyphens, and apostrophes")
    private String name;

    private String current_password;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    private String new_password;


    @NotNull
    private Role role;

    private MultipartFile avatar;
}
