package com.booksen.api.user;

import com.booksen.api.dto.user.CreateUserDTO;
import com.booksen.api.dto.user.LoginUserDTO;
import com.booksen.api.dto.user.UpdateUserDTO;
import com.booksen.api.dto.user.UserResponseDTO;
import com.booksen.api.helpers.FileServices;
import com.booksen.api.helpers.HelperUserService;
import com.booksen.api.model.ResourceNotFoundException;
import com.booksen.api.model.Response;
import com.booksen.api.model.Role;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final FileServices fileServices;
    private final AuthenticationManager authenticationManager;
    private final HelperUserService helperUserService;
    private final Validator validator;

    public Response<UserResponseDTO> getUserById(String id) {
        log.info("Getting user with the id ({})", id);
        return userRepository.findById(id)
                .map(u -> Response.ok(helperUserService.toResponseUserDTO(u), "Success"))
                .orElseGet(() -> Response.notFound("User not found."));

    }

    public Response<Object> createUser(CreateUserDTO dto) {
        log.info("Creating user.");
        Response<Object> buildUserResponse = helperUserService.createUserValidation(dto);
        if (buildUserResponse != null && buildUserResponse.getStatus() != HttpStatus.OK.value()) {return buildUserResponse;}

        String avatar = buildUserResponse != null ? (String) buildUserResponse.getData() : null;

        User user = helperUserService.toUserFromCreateUserDTO(dto, avatar);
        return helperUserService.buildAuthResponse(userRepository.save(user), "user has been created successfully.", HttpStatus.CREATED.value());
    }

    public Response<Object> getUserAvatar(String filename) {
        return fileServices.getAvatar(filename);
    }

    public Response<Object> authenticate(LoginUserDTO loginRequest) {
        User user = userRepository.findUserByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        return helperUserService.buildAuthResponse(user, "user has been authenticated successfully.", HttpStatus.OK.value());
    }

    public Response<Object> updateUser(String userId, UpdateUserDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Response<Object> updateResponse = helperUserService.updateEntity(user, dto);
        if (updateResponse != null) return updateResponse;

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if (!violations.isEmpty()) {
            List<String> errors = violations.stream()
                    .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                    .collect(Collectors.toList());
            return new Response<>(HttpStatus.BAD_REQUEST.value(), errors, "Validation failed.");
        }
        return new Response<>(HttpStatus.OK.value(), userRepository.save(user), "user has been updated successfully.");
    }

    public Response<Object> deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.deleteById(id);
        return new Response<>(HttpStatus.OK.value(), userRepository.save(user), "User deleted successfully");
    }

    public Response<List<UserResponseDTO>> getUsers(Role role) {
        List<UserResponseDTO> users = userRepository.findAllByRole(role).stream()
                .map(helperUserService::toResponseUserDTO)
                .collect(Collectors.toList());
        return Response.ok(users, "Success");
    }

    public Response<Object> updateRole(String id, Role role) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!(role == Role.USER || role == Role.ADMIN) || targetUser.getRole() == role) {
            return Response.badRequest("Invalid role or same role as target user.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (!currentUser.getRole().equals(Role.ADMIN)) {
            throw new AccessDeniedException("Only admins can update user roles");
        }

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new IllegalStateException("Users cannot modify their own role");
        }

        targetUser.setRole(role);
        User updatedUser = userRepository.save(targetUser);

        return Response.ok(helperUserService.toResponseUserDTO(updatedUser), "user role has been updated successfully.");
    }
}
