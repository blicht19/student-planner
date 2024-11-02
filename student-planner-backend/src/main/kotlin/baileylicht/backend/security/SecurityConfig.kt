package baileylicht.backend.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig(@Autowired private val userDetailsService: PlannerUserDetailsService) {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.csrf { csrf -> csrf.disable() }.authorizeHttpRequests { httpRequests ->
            httpRequests.requestMatchers("/auth/**").permitAll()
            httpRequests.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            httpRequests.anyRequest().authenticated()
        }.httpBasic(Customizer.withDefaults())

        return http.build()
    }

    @Bean
    fun users(): UserDetailsService {
        val user: UserDetails = User.builder().username("user").password("password").build();
        return InMemoryUserDetailsManager(user)
    }

    @Bean
    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration): AuthenticationManager {
        return authenticationConfiguration.authenticationManager
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
}