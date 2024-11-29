package baileylicht.backend.services

import baileylicht.backend.dtos.EventResponseDto
import baileylicht.backend.models.Event
import baileylicht.backend.repositories.EventRepository
import baileylicht.backend.utilities.localDateToString
import baileylicht.backend.utilities.localTimeToString
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

/**
 * Converts an event entity to a DTO to be returned to the client
 * @param event The JPA entity representation of an event
 * @return The DTO representation of an event
 */
private fun eventToEventResponseDto(event: Event): EventResponseDto {
    return EventResponseDto(
        event.name,
        localDateToString(event.date),
        localTimeToString(event.startTime),
        localTimeToString(event.endTime),
        event.location,
        event.note,
        event.id
    )
}

@Service
class EventService(@Autowired private val eventRepository: EventRepository) :
    DateRangePlannerItemService<Event, EventRepository, EventResponseDto>(eventRepository) {
    override fun convertEntitiesToResponseDtos(entities: List<Event>): List<EventResponseDto> {
        return entities.map { eventToEventResponseDto(it) }
    }

    override fun findAllEntitiesByUserId(userId: Long): List<Event> {
        return eventRepository.findAllByUserId(userId)
    }

    override fun getItem(userId: Long, id: Long): Event? {
        return eventRepository.findByUserIdAndId(userId, id)
    }

    @Transactional
    override fun deleteItem(userId: Long, id: Long): Long {
        return eventRepository.deleteByUserIdAndId(userId, id)
    }

    override fun findAllEntitiesInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Event> {
        return eventRepository.findAllInDateRange(userId, startDate, endDate)
    }
}