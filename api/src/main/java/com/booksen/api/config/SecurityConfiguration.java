package com.booksen.api.config;

import com.booksen.api.config.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final JwtDecoder jwtDecoder;
    private final CustomCorsConfiguration customCorsConfiguration;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req
                                .requestMatchers(new String[]{"/api/v1/user/auth/**", "/api/v1/user/avatar/**", "/api/v1/books/cover/**"}).permitAll()
                                .requestMatchers("/api/v1/user/admin/**").hasRole("ADMIN")
                                .anyRequest()
                                .authenticated()
                )
                .cors(c -> c.configurationSource(customCorsConfiguration))
//                .exceptionHandling(ex -> ex.accessDeniedHandler(accessDeniedHandler))
                // This line configures how the session is managed in your application.
                // SessionCreationPolicy.STATELESS: This means that the application will not create or use an HTTP session to store the user's security context.
                // Stateless: Every request must be independently authenticated because no session state is maintained between request
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                /*
                 * This specifies which authentication provider is responsible for verifying user credentials and providing the authenticated user's details.
                 * Client Request → Authentication Manager → Authentication Provider → UserDetailsService → Password Encoding → Authentication Success/Failure
                 */
                .authenticationProvider(authenticationProvider)
//                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt
//                        .decoder(jwtDecoder)
//                        .jwtAuthenticationConverter(jwtAuthConverter())
//                    )
//                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt ->
                jwt.getClaimAsStringList("roles").stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
        );
        return converter;
    }
}

