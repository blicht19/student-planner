package baileylicht.backend.repositories

import baileylicht.backend.models.RevokedToken
import org.springframework.data.jpa.repository.JpaRepository

interface RevokedTokensRepository : JpaRepository<RevokedToken, String> {
    fun deleteByExpirationLessThan(timeInMilliseconds: Long)
}