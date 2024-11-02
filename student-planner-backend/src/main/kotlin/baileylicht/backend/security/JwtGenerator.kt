package baileylicht.backend.security

import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtGenerator {
    @Value("\${studentplanner.jwt.expiration}")
    private lateinit var expiration: Number

    private val secretKey = Jwts.SIG.HS256.key().build()

    fun generateToken(authentication: Authentication): String {
        val username = authentication.name
        val currentDate = Date()
        val expirationDate = Date(currentDate.time + expiration.toLong())

        val token =
            Jwts.builder().subject(username).issuedAt(currentDate).expiration(expirationDate).signWith(secretKey)
                .compact()
        return token
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
}