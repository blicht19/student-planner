package baileylicht.backend.configuration

import baileylicht.backend.models.UserEntity
import baileylicht.backend.repositories.UserRepository
import baileylicht.backend.security.Role
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class StartupEventListener(
    @Autowired private val userRepository: UserRepository,
    @Autowired private val passwordEncoder: PasswordEncoder
) {
    @Value("\${studentplanner.admin.username}")
    private lateinit var adminUsername: String

    @Value("\${studentplanner.admin.password}")
    private lateinit var adminPassword: String


    @EventListener
    fun appReady(event: ApplicationReadyEvent) {
        val encodedPassword = passwordEncoder.encode(adminPassword)
        if (userRepository.findByUsername(adminUsername) == null) {
            val user = UserEntity(username = adminUsername, password = encodedPassword, role = Role.ADMIN)
            userRepository.save(user)
        }
    }
}