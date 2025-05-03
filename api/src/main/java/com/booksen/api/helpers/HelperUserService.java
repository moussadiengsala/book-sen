package com.booksen.api.helpers;

import com.booksen.api.config.jwt.JwtService;
import com.booksen.api.dto.user.CreateUserDTO;
import com.booksen.api.dto.user.UpdateUserDTO;
import com.booksen.api.dto.user.UserResponseDTO;
import com.booksen.api.model.AuthenticationResponse;
import com.booksen.api.model.Response;
import com.booksen.api.model.Role;
import com.booksen.api.user.User;
import com.booksen.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class HelperUserService {
    private final PasswordEncoder passwordEncoder;
    private final FileServices fileServices;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public Response<Object> createUserValidation(CreateUserDTO dto) {
        if (userRepository.findUserByEmail(dto.getEmail()).isPresent()) return Response.badRequest("Email already in use.");
        return this.processAvatar(dto.getAvatar());
    }

    public User toUserFromCreateUserDTO(CreateUserDTO dto, String avatar) {
        return User.builder()
                .name(dto.getName().trim().toLowerCase())
                .email(dto.getEmail().toLowerCase())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.USER)
                .avatar(avatar)
                .build();
    }

    public UserResponseDTO toResponseUserDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .build();
    }

    public Response<Object> buildAuthResponse(User user, String message, int status) {
        var jwtToken = jwtService.generateToken(user);

        return Response.<Object>builder()
                .status(status)
                .message(message)
                .data(AuthenticationResponse.builder()
                        .accessToken(jwtToken)
                        .build())
                .build();
    }


    private Response<Object> processAvatar(MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) return null;

        try {
            Response<Object> fileValidationResponse = fileServices.validateFile(avatar);
            if (fileValidationResponse != null) {
                return fileValidationResponse;
            }

            return new Response<Object>(HttpStatus.OK.value(), fileServices.saveFile(avatar), "");
        } catch (Exception e) {
            return Response.<Object>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .data(null)
                    .message(e.getMessage())
                    .build();
        }
    }

    public Response<Object> updateEntity(User entity, UpdateUserDTO dto) {
        boolean isUpdated = false;
        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            entity.setName(dto.getName().trim().toLowerCase());
            isUpdated = true;
        }

        if (dto.getCurrent_password() != null && dto.getNew_password() != null) {
            if (passwordEncoder.matches(dto.getCurrent_password(), entity.getPassword())) {
                entity.setPassword(passwordEncoder.encode(dto.getNew_password()));
            } else {
                return Response.badRequest("Previous password does not match");
            }
            isUpdated = true;
        }

        // Update avatar if provided
        if (dto.getAvatar() != null) {
            Response<Object> response = this.processAvatar(dto.getAvatar());
            if (response.getStatus() != HttpStatus.OK.value()) return response;

            try {
                if (entity.getAvatar() != null) {
                    Response<Object> responseDeleted = fileServices.deleteOldImage(entity.getAvatar());
                    if (responseDeleted.getStatus() != HttpStatus.OK.value()) return responseDeleted;
                }

                // Set the new avatar URL
                String avatarUrl = (String) response.getData();
                entity.setAvatar(avatarUrl);
            } catch (IOException e) {
                return new Response<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to process avatar", null);
            }
            isUpdated = true;
        }

        if (!isUpdated) {
            return Response.badRequest("At least one field to update must be provided");
        }
        return null;
    }

}
