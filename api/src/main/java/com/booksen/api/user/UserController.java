package com.booksen.api.user;

import com.booksen.api.dto.user.CreateUserDTO;
import com.booksen.api.dto.user.LoginUserDTO;
import com.booksen.api.dto.user.UpdateUserDTO;
import com.booksen.api.dto.user.UserResponseDTO;
import com.booksen.api.model.Response;
import com.booksen.api.model.Role;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<Response<UserResponseDTO>> getUserById(@PathVariable String id) {
        Response<UserResponseDTO> response = userService.getUserById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping
    public ResponseEntity<Response<List<UserResponseDTO>>> getAllUsers() {
        Response<List<UserResponseDTO>> users = userService.getUsers(Role.USER);
        return ResponseEntity.status(users.getStatus()).body(users);
    }

    @GetMapping("/avatar/{filename}")
    public ResponseEntity<Object> getUserAvatar(@PathVariable String filename) {
        Response<Object> response = userService.getUserAvatar(filename);
        if (response.getStatus() != HttpStatus.OK.value()) {
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        Resource resource = (Resource) response.getData();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        headers.setContentDispositionFormData("inline", resource.getFilename());

        return ResponseEntity.status(response.getStatus()).headers(headers).body(resource);
    }

    @PostMapping(value = "/auth/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<Object>> createUser(
            @Valid @ModelAttribute CreateUserDTO user
    ) {
        Response<Object> response = userService.createUser(user);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/update-role/{id}")
    public ResponseEntity<Response<Object>> updateUserRole(@PathVariable String id, @RequestBody Role role) {
        Response<Object> response = userService.updateRole(id, role);
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @PostMapping("/auth/login")
    public ResponseEntity<Response<Object>> authenticate(@Valid @RequestBody LoginUserDTO user) {
        Response<Object> response = userService.authenticate(user);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PreAuthorize("#id == authentication.principal.id")
    @PutMapping("/{id}")
    public ResponseEntity<Response<Object>> updateUser(
            @PathVariable String id,
            @Valid @ModelAttribute UpdateUserDTO updateUserDTO
            ) {
        Response<Object> updatedUser = userService.updateUser(id, updateUserDTO);
        return ResponseEntity.status(updatedUser.getStatus()).body(updatedUser);
    }

    @PreAuthorize("#id == authentication.principal.id || hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Object>> deleteUser(@PathVariable String id) {
        Response<Object> deletedUser = userService.deleteUser(id);
        return ResponseEntity.status(deletedUser.getStatus()).body(deletedUser);
    }

}
