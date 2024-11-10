package baileylicht.backend.services

import baileylicht.backend.repositories.UserRepository
import baileylicht.backend.models.PlannerUserDetails
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class PlannerUserDetailsService(@Autowired private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): PlannerUserDetails {
        val user = userRepository.findByUsername(username) ?: throw UsernameNotFoundException(username)

        return PlannerUserDetails(user)
    }
}