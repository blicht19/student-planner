package baileylicht.backend.services

import baileylicht.backend.models.UserEntity
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.lang.System.currentTimeMillis
import java.sql.Timestamp
import java.time.Instant

private const val LOCK_TIME = 60 * 60 * 1000
private const val MAX_LOGIN_ATTEMPTS = 5

private fun lockAccount(user: UserEntity) {
    user.accountLocked = true
    user.lockTime = Timestamp.from(Instant.now())
}

@Service
class UserLockoutService(@Autowired private val userService: UserService) {
    /**
     * If the username matches an existing user, increment the number of failed login attempts for the user.
     * If the number of failed logins exceeds MAX_LOGIN_ATTEMPTS, lock the account for LOCK_TIME
     * @param username The username from the failed login attempt
     */
    fun incrementFailedLoginAttempts(username: String) {
        val user = userService.getUserByUsername(username) ?: return
        user.failedLoginAttempts++
        if (user.failedLoginAttempts > MAX_LOGIN_ATTEMPTS) {
            lockAccount(user)
        }
        userService.saveUser(user)
    }

    /**
     * Resets the number of failed login attempts for the user
     * @param username The username of the user that should have the number of failed login attempts reset
     */
    fun resetFailedLoginAttempts(username: String) {
        val user =
            userService.getUserByUsername(username) ?: throw UsernameNotFoundException("Could not find user $username")
        userService.saveUser(user)
    }

    /**
     * Unlock the user's account if the required time has passed since the account was locked.
     * @param username The username of the user attempting to log in
     */
    fun unlockAccountIfTimeExpired(username: String): Boolean {
        val user = userService.getUserByUsername(username) ?: return false
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