package baileylicht.backend.controllers.auth

import baileylicht.backend.dtos.RegisterDto
import baileylicht.backend.models.UserEntity
import baileylicht.backend.repositories.UserRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
@Tag(name = "Authorization")
class LoginController(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val passwordEncoder: PasswordEncoder
) {
    @PostMapping("register", produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Register a user", description = "Creates a new user account")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "201",
            description = "Account created"
        ), ApiResponse(responseCode = "409", description = "User with this username already exists")]
    )
    fun register(@RequestBody registerDto: RegisterDto): ResponseEntity<Any> {
        if (userRepository.existsByUsername(registerDto.username)) {
            return ResponseEntity("User with this username already exists", HttpStatus.CONFLICT)
        }

        val password = passwordEncoder.encode(registerDto.password)
        val user = UserEntity(registerDto.username, password)
        userRepository.save(user)

        return ResponseEntity("User registered successfully", HttpStatus.CREATED)
    }
}