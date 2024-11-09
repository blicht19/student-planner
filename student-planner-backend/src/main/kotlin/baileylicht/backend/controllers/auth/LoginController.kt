package baileylicht.backend.controllers.auth

import baileylicht.backend.dtos.AuthResponseDto
import baileylicht.backend.dtos.UserDto
import baileylicht.backend.services.LoginService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
@Tag(name = "Authorization")
class LoginController(@Autowired private val loginService: LoginService) {
    @PostMapping("register", produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Register a user", description = "Creates a new user account")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Account created"
            ),
            ApiResponse(responseCode = "409", description = "User with this username already exists"),
            ApiResponse(responseCode = "400", description = "Bad request"),
        ]
    )
    fun register(@RequestBody userDto: UserDto): ResponseEntity<String> {
        val username = userDto.username.trim()
        val password = userDto.password.trim()

        if (loginService.userExists(username)) {
            return ResponseEntity("User with this username already exists.", HttpStatus.CONFLICT)
        }

        if (loginService.passwordHasBeenCompromised(password)) {
            return ResponseEntity(
                "This password has been compromised. Please use a different password.",
                HttpStatus.BAD_REQUEST
            )
        }

        if (!loginService.isPasswordValid(password)) {
            return ResponseEntity(
                "Password does not meet length requirements. Password must be at least ${loginService.minimumPasswordLength} characters and at most ${loginService.maximumPasswordLength} characters.",
                HttpStatus.BAD_REQUEST
            )
        }

        loginService.createUser(username, password)
        return ResponseEntity("User registered successfully", HttpStatus.CREATED)
    }

    @PostMapping("login", consumes = [MediaType.APPLICATION_JSON_VALUE], produces = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Log in", description = "Logs a user into the application")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully logged in"
            ),
            ApiResponse(responseCode = "401", description = "Unauthorized"),
        ]
    )
    fun login(@RequestBody userDto: UserDto): ResponseEntity<AuthResponseDto> {
        val username = userDto.username.trim()
        val password = userDto.password.trim()

        var warning: String? = null
        if (loginService.passwordHasBeenCompromised(password)) {
            warning = "This password has been compromised. Please change your password immediately"
        }

        val (userDetails, cookie) = loginService.login(username, password)
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie)
            .body(AuthResponseDto(userDetails.username, userDetails.id, warning))
    }

    @PostMapping("logout", produces = [MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Log out", description = "Logs a user out of the application")
    @ApiResponses(
        value = [ApiResponse(responseCode = "200", description = "Successfully logged out")]
    )
    fun logout(): ResponseEntity<String> {
        val responseCookie = loginService.logout()
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie).body("Successfully logged out.")
    }
}