package com.booksen.api.helpers;

import com.booksen.api.model.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileServices {
    private final long maxFileSize;
    private final List<String> allowedContentTypes;
    private final String baseUploadDirectory;

    public FileServices(
            @Value("${application.media.upload.max-file-size}") long maxFileSize,
            @Value("${application.media.upload.allowed-content-types}") List<String> allowedContentTypes,
            @Value("${application.media.upload.base-dir}") String baseUploadDirectory
    ) {
        this.maxFileSize = maxFileSize;
        this.allowedContentTypes = allowedContentTypes;
        this.baseUploadDirectory = baseUploadDirectory;
    }

    public Response<Object> validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return buildErrorResponse("No files provided");
        }

        if (file.isEmpty()) {
            return buildErrorResponse("Empty file detected");
        }

        if (file.getSize() > maxFileSize) {
            return buildErrorResponse("File size exceeds limit: " + formatSize(maxFileSize));
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedContentTypes.contains(contentType)) {
            return buildErrorResponse("Invalid file type. Allowed: " + allowedContentTypes);
        }

        return null;
    }

    public String saveFile(MultipartFile file) throws IOException {
        String uploadDir = baseUploadDirectory + "/";
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String uniqueFilename = generateUniqueFilename(file);
        Path targetLocation = uploadPath.resolve(uniqueFilename).normalize();

        if (!targetLocation.startsWith(uploadPath)) {
            throw new IOException("Invalid file path detected");
        }

        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFilename;
    }

    private String generateUniqueFilename(MultipartFile file) {
        String sanitizedName = sanitizeFilename(file.getOriginalFilename());
        String extension = getImageExtension(sanitizedName);
        return UUID.randomUUID() + extension;
    }

    private String sanitizeFilename(String filename) {
        return Optional.ofNullable(filename)
                .map(name -> name.replaceAll("[^a-zA-Z0-9._-]", ""))
                .orElse("");
    }

    private String formatSize(long bytes) {
        return bytes / 1024 / 1024 + " MB";
    }

    private Response<Object> buildErrorResponse(String message) {
        return Response.<Object>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(message)
                .build();
    }

    private String getImageExtension(String image) {
        return Optional.ofNullable(image)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(f.lastIndexOf(".")).toLowerCase())
                .orElse("");
    }

    public Response<Object> deleteOldImage(String image) throws IOException {
        Path filePath = Paths.get(baseUploadDirectory).resolve(image).normalize();
        if (!filePath.startsWith(Paths.get(baseUploadDirectory))) {
            return buildErrorResponse("Invalid file path");
        }
        Files.deleteIfExists(filePath);
        return null;
    }

    public Response<Object> getImage(String image) {
        try {
            if (image == null || image.isBlank()) {
                return buildErrorResponse("Invalid image path");
            }

            Path filePath = Paths.get(baseUploadDirectory).resolve(image).normalize();
            if (!filePath.startsWith(Paths.get(baseUploadDirectory))) {
                return buildErrorResponse("Invalid image path");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return buildErrorResponse("Image not found");
            }

            return Response.<Object>builder()
                    .message("Success")
                    .status(HttpStatus.OK.value())
                    .data(resource)
                    .build();
        } catch (Exception e) {
            return buildErrorResponse("Failed to retrieve the image");
        }
    }
}
