package baileylicht.backend.services

import baileylicht.backend.models.UserEntity
import baileylicht.backend.security.JwtComponent
import baileylicht.backend.models.PlannerUserDetails
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.authentication.password.CompromisedPasswordChecker
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import kotlin.jvm.Throws

@Service
class LoginService(
    @Autowired private val authenticationManager: AuthenticationManager,
    @Autowired private val userService: UserService,
    @Autowired private val passwordEncoder: PasswordEncoder,
    @Autowired private val jwtComponent: JwtComponent,
    @Autowired private val compromisedPasswordChecker: CompromisedPasswordChecker,
    @Autowired private val revokedTokenService: RevokedTokenService
) {
    val minimumPasswordLength = 12
    val maximumPasswordLength = 100
    val minimumUsernameLength = 5
    val maximumUsernameLength = 40

    /**
     * Checks a password against the Have I Been Pwned API to see if it has been compromised
     * @param password A password to check against the Have I Been Pwned API
     * @return true if the password has been compromised
     */
    fun passwordHasBeenCompromised(password: String): Boolean {
        val decision = compromisedPasswordChecker.check(password)
        return decision.isCompromised
    }

    /**
     * Checks if a username meets length requirements.
     * @param username The username to validate
     * @return true if the username is at least minimumUsernameLength and at most maximumUsernameLength
     */
    fun isUsernameValid(username: String): Boolean {
        return username.length in minimumUsernameLength..maximumUsernameLength
    }

    /**
     * Checks if password meets length requirements. The NIST does not recommend requiring any special characters.
     * See https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf
     * @param password The password to validate
     * @return true if the password is at least minimumPasswordLength and at most maximumPasswordLength
     */
    fun isPasswordValid(password: String): Boolean {
        return password.length in minimumPasswordLength..maximumPasswordLength
    }

    /**
     * Adds a new user to the database
     * @param username The new user's username
     * @param password The new user's password
     */
    fun createUser(username: String, password: String) {
        val encodedPassword = passwordEncoder.encode(password)
        val user = UserEntity(username, encodedPassword)
        userService.saveUser(user)
    }

    /**
     * Sets the user details in the security context and generates a cookie for the user
     * @param username The user's username
     * @param password The user's password
     * @return A pair containing the newly logged-in user's username and the string representation of the cookie
     */
    @Throws(AuthenticationException::class)
    fun login(username: String, password: String): Pair<PlannerUserDetails, String> {
        val authentication =
            authenticationManager.authenticate(UsernamePasswordAuthenticationToken(username, password))
        SecurityContextHolder.getContext().authentication = authentication
        val userDetails = authentication.principal as PlannerUserDetails
        val cookie = jwtComponent.generateJwtCookie(userDetails)

        return Pair(userDetails, cookie.toString())
    }

    /**
     * Logs the user out
     * @return The string representation of an empty cookie to be returned to the user
     */
    fun logout(request: HttpServletRequest): String {
        val jwt = jwtComponent.getJwtFromCookies(request)
        if (jwt != null) {
            val expirationDate = jwtComponent.getExpirationDateFromToken(jwt)
            revokedTokenService.revokeToken(jwt, expirationDate)
        }

        SecurityContextHolder.clearContext()
        return jwtComponent.clearJwtCookie().toString()
    }

    /**
     * Returns the User entity for the user that is logged in
     * @return The User that is logged in
     */
    fun getLoggedInUser(): UserEntity? {
        val userDetails = SecurityContextHolder.getContext()?.authentication?.principal as PlannerUserDetails?
        return userDetails?.user
    }

    /**
     * Returns the ID number of the logged-in User
     * @return The ID number of the logged-in User
     */
    fun getLoggedInUserId(): Long? {
        return getLoggedInUser()?.id
    }
}