package baileylicht.backend.configuration

import baileylicht.backend.services.RevokedTokenService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
class ScheduledTasks(@Autowired private val revokedTokenService: RevokedTokenService) {
    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.DAYS)
    fun clearExpiredTokensFromBlacklist() {
        revokedTokenService.deleteExpiredTokens()
    }
}