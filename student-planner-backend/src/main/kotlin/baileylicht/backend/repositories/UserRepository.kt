package baileylicht.backend.repositories

import baileylicht.backend.models.UserEntity
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<UserEntity, Long> {
    fun findByUsername(username: String): UserEntity?
    fun existsByUsername(username: String): Boolean
}