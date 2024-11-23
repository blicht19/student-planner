package baileylicht.backend.repositories

import baileylicht.backend.models.Exam
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface ExamRepository : JpaRepository<Exam, Long> {
    fun findAllByUserId(userId: Long): List<Exam>
    fun findByUserIdAndId(userId: Long, id: Long): Exam?
    fun deleteByUserIdAndId(userId: Long, id: Long): Long
    fun findAllByUserIdAndDate(userId: Long, date: LocalDate): List<Exam>

    @Query("select e from Exam e where e.user.id = :userId and e.date >= :startDate and e.date <= :endDate")
    fun findAllInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Exam>
}