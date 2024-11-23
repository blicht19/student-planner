package baileylicht.backend.repositories

import baileylicht.backend.models.Task
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface TaskRepository : JpaRepository<Task, Long> {
    fun findAllByUserId(userId: Long): List<Task>
    fun findByUserIdAndId(userId: Long, id: Long): Task?
    fun deleteByUserIdAndId(userId: Long, id: Long): Long

    @Query("select t from Task t where t.user.id = :userId and t.dueDate >= :startDate and t.dueDate <= :endDate")
    fun findAllInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Task>

    @Query("select t from Task t where t.user.id = :userId and not t.complete and t.dueDate >= :startDate and t.dueDate <= :endDate")
    fun findAllIncompleteInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Task>
}