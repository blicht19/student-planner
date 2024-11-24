package baileylicht.backend.repositories

import baileylicht.backend.models.Event
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface EventRepository : JpaRepository<Event, Long> {
    fun findAllByUserId(userId: Long): List<Event>
    fun findByUserIdAndId(userId: Long, id: Long): Event?
    fun deleteByUserIdAndId(userId: Long, id: Long): Long

    @Query("select e from Event e where e.user.id = :userId and e.date >= :startDate and e.date <= :endDate")
    fun findAllInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Event>
}