package baileylicht.backend.repositories

import baileylicht.backend.models.Assignment
import org.springframework.data.jpa.repository.JpaRepository

interface AssignmentRepository : JpaRepository<Assignment, Long> {
    fun findAllByUserId(userId: Long): List<Assignment>
    fun findByUserIdAndId(userId: Long, id: Long): Assignment?
    fun deleteByUserIdAndId(userId: Long, id: Long): Long
}