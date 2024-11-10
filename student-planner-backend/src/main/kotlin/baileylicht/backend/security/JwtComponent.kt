package baileylicht.backend.security

import io.jsonwebtoken.Jwts
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import org.springframework.web.util.WebUtils
import java.util.*

@Component
class JwtComponent {
    /**
     * The length of time before the jwt token should expire in milliseconds
     */
    @Value("\${studentplanner.jwt.expiration}")
    private lateinit var expiration: Number

    /**
     * The name of the JWT cookie
     */
    @Value("\${studentplanner.jwt.cookie-name}")
    private lateinit var cookieName: String

    /**
     * The secret key to be used for generating JWT tokens
     * TODO: This should probably be generated externally?
     */
    private val secretKey = Jwts.SIG.HS256.key().build()

    /**
     * Generates a JWT
     * @param username The user's username
     * @return A JWT for the user
     */
    private fun generateToken(username: String): String {
        val currentDate = Date()
        val expirationDate = Date(currentDate.time + expiration.toLong())

        return Jwts.builder().subject(username).issuedAt(currentDate).expiration(expirationDate).signWith(secretKey)
            .compact()
    }

    /**
     * Generates the HTTP only cookie that will store the user's JWT
     * @param userDetails A UserDetails object containing the user's username
     * @return The HTTP only cookie containing the user's JWT
     */
    fun generateJwtCookie(userDetails: UserDetails): ResponseCookie {
        val token = generateToken(userDetails.username)
        val responseCookie = ResponseCookie.from(cookieName, token).path("/").httpOnly(true).build()
        return responseCookie
    }

    /**
     * Creates an empty cookie to be returned to the user to clear out their JWT cookie on logout
     * @return An empty cookie
     */
    fun clearJwtCookie(): ResponseCookie {
        return ResponseCookie.from(cookieName).path("/").maxAge(0).build()
    }

    /**
     * Parses the username from JWT
     * @param token A JWT
     * @return The username stored in a JWT
     */
    fun getUsernameFromToken(token: String): String {
        val claims = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).payload
        return claims.subject
    }

    /**
     * Get the expiration date for a JWT
     * @param token A JWT
     * @return The expiration date for the token
     */
    fun getExpirationDateFromToken(token: String): Date {
        val claims = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).payload
        return claims.expiration
    }

    /**
     * Verifies that a JWT is valid
     * @return true if the token is valid
     * @throws AuthenticationCredentialsNotFoundException if the token is invalid or expired
     */
    fun validateToken(token: String): Boolean {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token)
            return true
        } catch (exception: Exception) {
            throw AuthenticationCredentialsNotFoundException("JWT was invalid or expired")
        }
    }

    /**
     * Gets the JWT stored in a cookie
     * @param request An HTTP request
     * @return The JWT stored in the cookie
     */
    fun getJwtFromCookies(request: HttpServletRequest): String? {
        val cookie = WebUtils.getCookie(request, cookieName)
        return cookie?.value ?: return null
    }
}