package baileylicht.backend.security

import baileylicht.backend.services.UserLockoutService
import baileylicht.backend.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.event.EventListener
import org.springframework.security.authentication.event.*
import org.springframework.stereotype.Component

@Component
class AuthenticationEventListener(
    @Autowired private val lockoutService: UserLockoutService,
    @Autowired private val userService: UserService
) {

    @EventListener
    fun onAuthenticationFailure(event: AbstractAuthenticationFailureEvent) {
        val username = event.authentication.principal as String
        val user = userService.getUserByUsername(username) ?: return

        when (event) {
            is AuthenticationFailureBadCredentialsEvent -> {
                lockoutService.incrementFailedLoginAttempts(user)
            }

            is AuthenticationFailureLockedEvent -> {
                lockoutService.unlockAccountIfTimeExpired(user)
            }
        }
    }

    @EventListener
    fun onAuthenticationSuccess(event: AuthenticationSuccessEvent) {
        val userDetails = event.authentication.principal as PlannerUserDetails
        lockoutService.resetFailedLoginAttempts(userDetails.user)
    }
}