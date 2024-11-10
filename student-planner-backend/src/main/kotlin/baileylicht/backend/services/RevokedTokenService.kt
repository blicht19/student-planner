package baileylicht.backend.services

import baileylicht.backend.models.RevokedToken
import baileylicht.backend.repositories.RevokedTokensRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.System.currentTimeMillis
import java.util.*

@Service
class RevokedTokenService(@Autowired private val revokedTokensRepository: RevokedTokensRepository) {
    fun isRevoked(token: String): Boolean {
        return revokedTokensRepository.existsById(token)
    }

    fun revokeToken(token: String, expirationDate: Date) {
        val revokedToken = RevokedToken(token, expirationDate.time)
        revokedTokensRepository.save(revokedToken)
    }

    fun deleteExpiredTokens() {
        val currentTime = currentTimeMillis()
        revokedTokensRepository.deleteByExpirationLessThan(currentTime)
    }
}