package baileylicht.backend.utilities

import baileylicht.backend.dtos.EventResponseDto
import baileylicht.backend.models.Event

/**
 * Converts an event entity to a DTO to be returned to the client
 * @param event The JPA entity representation of an event
 * @return The DTO representation of an event
 */
fun eventToEventResponseDto(event: Event): EventResponseDto {
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

/**
 * Converts a list of event entities to a list to a list of event DTOs
 * @param events A list of event entities
 * @return A list of event DTOs
 */
fun eventListToEventResponseDtoList(events: List<Event>): List<EventResponseDto> {
    return events.map { eventToEventResponseDto(it) }
}