package baileylicht.backend.services

import baileylicht.backend.dtos.EventResponseDto
import baileylicht.backend.models.Event
import baileylicht.backend.repositories.EventRepository
import baileylicht.backend.utilities.eventListToEventResponseDtoList
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class EventService(@Autowired private val eventRepository: EventRepository) {
    fun getAll(userId: Long): List<EventResponseDto> {
        val events = eventRepository.findAllByUserId(userId)
        return eventListToEventResponseDtoList(events)
    }

    fun getAllInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<EventResponseDto> {
        val events = eventRepository.findAllInDateRange(userId, startDate, endDate)
        return eventListToEventResponseDtoList(events)
    }

    fun getAllOnDate(userId: Long, date: LocalDate): List<EventResponseDto> {
        return getAllInDateRange(userId, date, date)
    }

    fun getEvent(userId: Long, eventId: Long): Event? {
        return eventRepository.findByUserIdAndId(userId, eventId)
    }

    fun saveEvent(event: Event) {
        eventRepository.save(event)
    }

    @Transactional
    fun deleteEvent(userId: Long, eventId: Long): Long {
        return eventRepository.deleteByUserIdAndId(userId, eventId)
    }
}