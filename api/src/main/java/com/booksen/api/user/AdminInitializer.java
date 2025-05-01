package com.booksen.api.user;

import com.booksen.api.model.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    public AdminInitializer(UserRepository userRepository,
                                 PasswordEncoder passwordEncoder,
                                 Environment env) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByRole(Role.ADMIN)) {
            User superAdmin = User.builder()
                    .name(env.getRequiredProperty("application.admin.name"))
                    .email(env.getRequiredProperty("application.admin.email"))
                    .password(passwordEncoder.encode(
                            env.getRequiredProperty("application.admin.password")
                    ))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(superAdmin);
        }
    }
}