package baileylicht.backend.services

import baileylicht.backend.dtos.UserInformationDto
import baileylicht.backend.repositories.UserRepository
import baileylicht.backend.utilities.timestampToString
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AdminService(@Autowired private val userRepository: UserRepository) {
    /**
     * Deletes a user
     * @param id The user's ID number
     */
    fun deleteUser(id: Long) {
        return userRepository.deleteById(id)
    }

    /**
     * Unlocks a user's account and resets the number of failed login attempts
     * @param id The user's ID number
     * @return Boolean indicating whether the account was found and unlocked
     */
    fun unlockUserAccount(id: Long): Boolean {
        val user = userRepository.findById(id).orElse(null) ?: return false
        user.accountLocked = false
        user.failedLoginAttempts = 0
        user.lockTime = null
        userRepository.save(user)
        return true
    }

    /**
     * Retrieves information for all users
     * @return A list of all Users
     */
    fun getAllUsers(): List<UserInformationDto> {
        val users = userRepository.findAll()
        return users.stream().map { user ->
            UserInformationDto(
                user.username,
                user.id!!,
                user.role.name,
                user.accountLocked,
                user.failedLoginAttempts,
                timestampToString(user.lockTime)
            )
        }.toList()
    }
}