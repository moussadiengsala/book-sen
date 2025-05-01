package com.booksen.api.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
public abstract class BaseService<T, ID, CUDTO, RDTO> {

    private final MongoRepository<T, ID> repository;
    private final Validator validator;
    private final EntityHelper<T, ID, CUDTO, RDTO> entityHelper;
    private final String entityName;

    protected BaseService(MongoRepository<T, ID> repository, Validator validator, EntityHelper<T, ID, CUDTO, RDTO> entityHelper, String entityName) {
        this.repository = repository;
        this.validator = validator;
        this.entityHelper = entityHelper;
        this.entityName = entityName;
    }

    public Response<RDTO> getById(ID id) {
        log.info("Fetching {} with ID: {}", this.entityName, id);
        Optional<T> entity = repository.findById(id);
        return entity
                .map(e -> new Response<>(HttpStatus.OK.value(), entityHelper.toResponseEntity(e), String.format("%s found successfully", this.entityName)))
                .orElseGet(() -> new Response<>(HttpStatus.NOT_FOUND.value(), null, String.format("%s not found", this.entityName)));
    }

    public Response<List<RDTO>> getAll() {
        log.info("Fetching all {} entities", entityName);
        List<RDTO> entities = repository.findAll().stream()
                .map(entityHelper::toResponseEntity).collect(Collectors.toList());
        return new Response<>(HttpStatus.OK.value(), entities,
                entities.isEmpty() ? String.format("No %s entities found", entityName) : String.format("%s entities retrieved successfully", entityName));
    }

    @Transactional
    public Response<List<RDTO>> create(List<CUDTO> dtos) {
        log.info("Creating {} entities", entityName);
        dtos.forEach(entityHelper::prepareForValidation);

        Map<Integer, List<String>> validationErrors = entityHelper.validate(dtos);
        if (!validationErrors.isEmpty()) {
            log.warn("Validation errors while creating {}: {}", entityName, validationErrors);
            return new Response<>(HttpStatus.BAD_REQUEST.value(), null, String.format("Validation errors while creating %s: %s", entityName, validationErrors));
        }

        Set<String> duplicateNames = entityHelper.findExistingNames(dtos);
        if (!duplicateNames.isEmpty()) {
            log.warn("Duplicate names found while creating {}: {}", entityName, duplicateNames);
            return new Response<>(HttpStatus.CONFLICT.value(), null, String.format("Duplicate names found while creating %s: %s", entityName, duplicateNames));
        }

        try {
            List<T> savedEntities = dtos.stream()
                    .map(entityHelper::toEntity)
                    .collect(Collectors.toList());
            List<T> result = repository.saveAll(savedEntities);
            log.info("Successfully created {} {} entities", savedEntities.size(), entityName);
            List<RDTO> entities = result.stream()
                    .map(entityHelper::toResponseEntity)
                    .collect(Collectors.toList());
            return new Response<>(HttpStatus.CREATED.value(), entities, String.format("Created %d %s entities successfully", savedEntities.size(), entityName));
        } catch (Exception e) {
            log.error("Error creating {}: {}", entityName, e.getMessage(), e);
            return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null, String.format("Error creating %s: %s", entityName, e.getMessage()));
        }
    }

    @Transactional
    public Response<RDTO> update(ID id, CUDTO updateDTO) {
        log.info("Updating {} with ID: {}", entityName, id);
        entityHelper.prepareForValidation(updateDTO);

        T entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("{} with ID {} not found", entityName, id);
                    return new ResourceNotFoundException(String.format("%s not found", entityName));
                });

        Response<Object> existingNameResponse = entityHelper.findExistingNameOnUpdate(id, updateDTO);
        if (existingNameResponse != null) {
            log.warn("Duplicate name found while updating {}: {}", entityName, existingNameResponse.getMessage());
            return new Response<>(existingNameResponse.getStatus(), null, existingNameResponse.getMessage());
        }

        entityHelper.updateEntity(entity, updateDTO);
        Set<ConstraintViolation<T>> violations = validator.validate(entity);
        if (!violations.isEmpty()) {
            log.warn("Validation errors while updating {}: {}", entityName, violations);
            throw new ConstraintViolationException(violations);
        }

        try {
            T updatedEntity = repository.save(entity);
            log.info("Successfully updated {} with ID: {}", entityName, id);
            return new Response<>(HttpStatus.OK.value(), entityHelper.toResponseEntity(updatedEntity), String.format("%s updated successfully", entityName));
        } catch (Exception e) {
            log.error("Error updating {}: {}", entityName, e.getMessage(), e);
            return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null, String.format("Error updating %s: %s", entityName, e.getMessage()));
        }
    }

    @Transactional
    public Response<Object> delete(ID id) {
        log.info("Deleting {} with ID: {}", entityName, id);
        T entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("{} with ID {} not found", entityName, id);
                    return new ResourceNotFoundException(String.format("%s not found", entityName));
                });

        try {
            repository.deleteById(id);
            log.info("Successfully deleted {} with ID: {}", entityName, id);
            return new Response<>(HttpStatus.OK.value(), entity, String.format("%s deleted successfully", entityName));
        } catch (Exception e) {
            log.error("Error deleting {}: {}", entityName, e.getMessage(), e);
            return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), null, String.format("Error deleting %s: %s", entityName, e.getMessage()));
        }
    }

}