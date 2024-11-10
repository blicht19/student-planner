package baileylicht.backend.services

import baileylicht.backend.models.RevokedToken
import baileylicht.backend.repositories.RevokedTokensRepository
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.System.currentTimeMillis
import java.util.*

@Service
class RevokedTokenService(@Autowired private val revokedTokensRepository: RevokedTokensRepository) {
    /**
     * Check if a JWT has been revoked
     * @param token The JWT to check
     * @return true if the JWT has been revoked
     */
    fun isRevoked(token: String): Boolean {
        return revokedTokensRepository.existsById(token)
    }

    /**
     * Adds a JWT to the list of revoked tokens
     * @param token The JWT
     * @param expirationDate The expiration date of the JWT. Needed so we can clear out expired tokens from the database
     */
    fun revokeToken(token: String, expirationDate: Date) {
        val revokedToken = RevokedToken(token, expirationDate.time)
        revokedTokensRepository.save(revokedToken)
    }

    /**
     * Removes expired tokens from the revoked tokens table
     */
    @Transactional
    fun deleteExpiredTokens() {
        val currentTime = currentTimeMillis()
        revokedTokensRepository.deleteByExpirationLessThan(currentTime)
    }
}