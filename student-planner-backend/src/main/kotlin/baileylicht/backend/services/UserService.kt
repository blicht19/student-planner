package baileylicht.backend.services

import baileylicht.backend.models.UserEntity
import baileylicht.backend.repositories.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService(@Autowired private val userRepository: UserRepository) {
    /**
     * Checks if a user with the given username exists
     *
     * @param username The username to be checked
     * @return true if a user with this username already exists
     */
    fun userExists(username: String): Boolean {
        return userRepository.existsByUsername(username)
    }

    /**
     * Retrieves the user with the given username
     * @param username The username to search for
     * @return A UserEntity with the matching username, null if none exists
     */
    fun getUserByUsername(username: String): UserEntity? {
        return userRepository.findByUsername(username)
    }

    /**
     * Saves a user to the database
     * @param user The user to save
     */
    fun saveUser(user: UserEntity) {
        userRepository.save(user)
    }
}