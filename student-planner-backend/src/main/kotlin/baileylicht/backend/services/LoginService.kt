package baileylicht.backend.services

import baileylicht.backend.dtos.UserDto
import baileylicht.backend.models.UserEntity
import baileylicht.backend.repositories.UserRepository
import baileylicht.backend.security.JwtComponent
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class LoginService(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val passwordEncoder: PasswordEncoder,
    @Autowired private val jwtComponent: JwtComponent
) {
    /**
     * Checks if a user with the same username as user already exists
     *
     * @param username The username to be checked
     * @return true if a user with this username already exists
     */
    fun userExists(username: String): Boolean {
        return userRepository.existsByUsername(username)
    }

    /**
     * Adds a new user to the database
     * @param userDto The DTO containing the new user's information
     */
    fun createUser(userDto: UserDto) {
        val password = passwordEncoder.encode(userDto.password)
        val user = UserEntity(userDto.username, password)
        userRepository.save(user)
    }

    /**
     * Sets the user details in the security context and generates a cookie for the user
     * @param userDto The DTO containing the user's information
     * @return A pair containing the newly logged-in user's username and the string representation of the cookie
     */
    fun login(userDto: UserDto): Pair<String, String> {
        val authentication =
            authenticationManager.authenticate(UsernamePasswordAuthenticationToken(userDto.username, userDto.password))
        SecurityContextHolder.getContext().authentication = authentication
        val userDetails = authentication.principal as UserDetails
        val cookie = jwtComponent.generateJwtCookie(userDetails)

        return Pair(userDetails.username, cookie.toString())
    }

    /**
     * Logs the user out
     * TODO: Set up a JWT blacklist, make this method add the user's old token and clear this security context
     * @return The string representation of an empty cookie to be returned to the user
     */
    fun logout(): String {
        return jwtComponent.clearJwtCookie().toString()
    }
}