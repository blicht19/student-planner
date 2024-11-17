package baileylicht.backend.repositories

import baileylicht.backend.models.Subject
import org.springframework.data.jpa.repository.JpaRepository

interface SubjectRepository : JpaRepository<Subject, Long> {
    fun findAllByUserId(userId: Long): List<Subject>
    fun findByUserIdAndId(userId: Long, id: Long): Subject?
    fun findAllByUserIdAndSundayIsTrue(userId: Long): List<Subject>
    fun findAllByUserIdAndMondayIsTrue(userId: Long): List<Subject>
    fun findAllByUserIdAndTuesdayIsTrue(userId: Long): List<Subject>
    fun findAllByUserIdAndWednesdayIsTrue(userId: Long): List<Subject>
    fun findAllByUserIdAndThursdayIsTrue(userId: Long): List<Subject>
    fun findAllByUserIdAndFridayIsTrue(userId: Long): List<Subject>
    fun findAllByUserIdAndSaturdayIsTrue(userId: Long): List<Subject>
    fun deleteByUserIdAndId(userId: Long, id: Long): Long
}