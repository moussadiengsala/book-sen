package com.booksen.api.dto.user;

import com.booksen.api.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDTO {
    private String id;
    private String name;
    private String email;
    private Role role;
    private String avatar;
}
