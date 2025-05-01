package com.booksen.api.dto.category;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponseDTO {
    private String id;
    private String name;
    private String icon;
}
