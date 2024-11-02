package baileylicht.backend.security

import io.jsonwebtoken.Jwts
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import org.springframework.web.util.WebUtils
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtGenerator {
    @Value("\${studentplanner.jwt.expiration}")
    private lateinit var expiration: Number

    @Value("\${studentplanner.jwt.cookie-name}")
    private lateinit var cookieName: String

    private val secretKey = Jwts.SIG.HS256.key().build()

    fun generateToken(username: String): String {
        val currentDate = Date()
        val expirationDate = Date(currentDate.time + expiration.toLong())

        return Jwts.builder().subject(username).issuedAt(currentDate).expiration(expirationDate).signWith(secretKey)
            .compact()
    }

    fun generateJwtCookie(userDetails: UserDetails): ResponseCookie {
        val token = generateToken(userDetails.username)
        val responseCookie = ResponseCookie.from(cookieName, token).path("/").httpOnly(true).build()
        return responseCookie
    }

    fun clearJwtCookie(): ResponseCookie {
        return ResponseCookie.from(cookieName).path("/").build()
    }

    fun getUsernameFromToken(token: String): String {
        val claims = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).payload
        return claims.subject
    }

    fun validateToken(token: String): Boolean {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token)
            return true
        } catch (exception: Exception) {
            throw AuthenticationCredentialsNotFoundException("JWT was invalid or expired")
        }
    }

    fun getJwtFromCookies(request: HttpServletRequest): String? {
        val cookie = WebUtils.getCookie(request, cookieName)
        return cookie?.value ?: return null
    }
}