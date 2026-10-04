package com.inventory.inventory_management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public auth and read-only catalogs
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/**", "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Customer-specific endpoints
                        .requestMatchers(HttpMethod.POST, "/orders").hasRole("CUSTOMER")
                        .requestMatchers("/orders/my-orders/**").hasRole("CUSTOMER")

                        // Seller-specific endpoints
                        .requestMatchers(HttpMethod.PUT, "/orders/*/complete").hasRole("SELLER")
                        .requestMatchers(HttpMethod.PUT, "/orders/*/status").hasRole("SELLER")
                        .requestMatchers(HttpMethod.GET, "/orders").hasRole("SELLER")
                        .requestMatchers("/sales/**", "/sale-items/**").hasRole("SELLER")

                        // Order detail view: accessible by Seller and Customer
                        .requestMatchers(HttpMethod.GET, "/orders/*").hasAnyRole("SELLER", "CUSTOMER")

                        // Buyer-specific operations (Purchases, Suppliers management, Inward stock, Product modifications)
                        .requestMatchers("/purchases/receive").hasRole("BUYER")
                        .requestMatchers(HttpMethod.POST, "/purchases/**", "/purchase-items/**").hasRole("BUYER")
                        .requestMatchers(HttpMethod.POST, "/suppliers/**").hasRole("BUYER")
                        .requestMatchers(HttpMethod.PUT, "/suppliers/**").hasRole("BUYER")
                        .requestMatchers(HttpMethod.DELETE, "/suppliers/**").hasRole("BUYER")
                        .requestMatchers(HttpMethod.POST, "/products/**", "/categories/**").hasRole("BUYER")
                        .requestMatchers(HttpMethod.PUT, "/products/**", "/categories/**").hasRole("BUYER")
                        .requestMatchers(HttpMethod.DELETE, "/products/**", "/categories/**").hasRole("BUYER")

                        // Buyer & Seller shared inventory viewing
                        .requestMatchers(HttpMethod.GET, "/purchases/**", "/purchase-items/**", "/suppliers/**").hasAnyRole("BUYER", "SELLER")
                        .requestMatchers(HttpMethod.GET, "/products/low-stock").hasAnyRole("BUYER", "SELLER")
                        .requestMatchers("/dashboard/**").hasAnyRole("SELLER", "BUYER", "CUSTOMER")

                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
