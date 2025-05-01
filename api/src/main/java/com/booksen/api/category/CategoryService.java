package com.booksen.api.category;

import com.booksen.api.dto.category.CategoryResponseDTO;
import com.booksen.api.dto.category.CreateUpdateCategoryDTO;
import com.booksen.api.helpers.CategoryHelper;
import com.booksen.api.model.BaseService;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class CategoryService extends BaseService<Category, String, CreateUpdateCategoryDTO, CategoryResponseDTO> {

    public CategoryService(CategoryRepository categoryRepository, Validator validator, CategoryHelper categoryHelper) {
        super(categoryRepository, validator, categoryHelper, "Category");
    }

}
