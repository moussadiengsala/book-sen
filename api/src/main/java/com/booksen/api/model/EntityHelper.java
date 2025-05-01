package com.booksen.api.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public interface EntityHelper<T, ID, CUDTO, RDTO> {
    void prepareForValidation(CUDTO dto);
    Map<Integer, List<String>> validate(List<CUDTO> dtos);
    Set<String> findExistingNames(List<CUDTO> dtos);

    RDTO toResponseEntity(T entity);
    T toEntity(CUDTO dto);

    Response<Object> findExistingNameOnUpdate(ID id, CUDTO dto);

    void updateEntity(T entity, CUDTO updateDTO);

    default Map<Integer, List<String>> validateEntities(List<CUDTO> dtos, Validator validator) {
        Map<Integer, List<String>> errors = new HashMap<>();
        for (int i = 0; i < dtos.size(); i++) {
            CUDTO dto = dtos.get(i);
            Set<ConstraintViolation<CUDTO>> violations = validator.validate(dto);
            if (!violations.isEmpty()) {
                errors.put(i, violations.stream()
                        .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                        .collect(Collectors.toList()));
            }
        }
        return errors;
    }
}