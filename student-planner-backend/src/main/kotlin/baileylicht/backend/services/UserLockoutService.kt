package baileylicht.backend.services

import baileylicht.backend.models.UserEntity
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.System.currentTimeMillis
import java.sql.Timestamp
import java.time.Instant

private const val LOCK_TIME = 60 * 1000
private const val MAX_LOGIN_ATTEMPTS = 5

private fun lockAccount(user: UserEntity) {
    user.accountLocked = true
    user.lockTime = Timestamp.from(Instant.now())
}

@Service
class UserLockoutService(@Autowired val userService: UserService) {
    fun incrementFailedLoginAttempts(user: UserEntity) {
        user.failedLoginAttempts++
        if (user.failedLoginAttempts > MAX_LOGIN_ATTEMPTS) {
            lockAccount(user)
        }
        userService.saveUser(user)
    }

    fun resetFailedLoginAttempts(user: UserEntity) {
        user.failedLoginAttempts = 0
        userService.saveUser(user)
    }

    fun unlockAccountIfTimeExpired(user: UserEntity): Boolean {
        if (user.lockTime != null && user.lockTime!!.time + LOCK_TIME > currentTimeMillis()) {
            return false
        }

        user.accountLocked = false
        user.lockTime = null
        user.failedLoginAttempts = 0
        userService.saveUser(user)
        return true
    }
}