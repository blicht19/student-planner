package baileylicht.backend.repositories

import baileylicht.backend.models.Assignment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface AssignmentRepository : JpaRepository<Assignment, Long> {
    fun findAllByUserId(userId: Long): List<Assignment>
    fun findByUserIdAndId(userId: Long, id: Long): Assignment?
    fun deleteByUserIdAndId(userId: Long, id: Long): Long

    @Query("select a from Assignment a where a.user.id = :userId and a.dueDate >= :startDate and a.dueDate <= :endDate")
    fun findAllInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Assignment>

    @Query("select a from Assignment a where a.user.id = :userId and not a.complete and a.dueDate >= :startDate and a.dueDate <= :endDate")
    fun findAllIncompleteInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Assignment>
}