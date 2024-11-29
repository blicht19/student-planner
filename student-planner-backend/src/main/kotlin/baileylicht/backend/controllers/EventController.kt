package baileylicht.backend.controllers

import baileylicht.backend.dtos.EventCreateUpdateDto
import baileylicht.backend.dtos.EventResponseDto
import baileylicht.backend.models.Event
import baileylicht.backend.repositories.EventRepository
import baileylicht.backend.services.EventService
import baileylicht.backend.services.LoginService
import baileylicht.backend.utilities.stringToLocalDate
import baileylicht.backend.utilities.stringToLocalTime
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/events")
@Tag(name = "Events")
class EventController(
    @Autowired private val eventService: EventService,
    @Autowired private val userLoginService: LoginService
) : DateRangePlannerItemController<Event, EventRepository, EventResponseDto, EventService, EventCreateUpdateDto>(
    eventService,
    userLoginService
) {
    override fun createItem(@RequestBody dto: EventCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = dto.name ?: return ResponseEntity("Event name is required", HttpStatus.BAD_REQUEST)
        if (dto.date == null) {
            return ResponseEntity("Event date is required", HttpStatus.BAD_REQUEST)
        }
        val date = stringToLocalDate(dto.date) ?: return ResponseEntity(
            "invalid date: ${dto.date}",
            HttpStatus.BAD_REQUEST
        )
        if (dto.startTime == null) {
            return ResponseEntity("Event start time is required", HttpStatus.BAD_REQUEST)
        }
        val startTime = stringToLocalTime(dto.startTime) ?: return ResponseEntity(
            "Invalid start time: ${dto.startTime}",
            HttpStatus.BAD_REQUEST
        )
        if (dto.endTime == null) {
            return ResponseEntity("Event end time is required", HttpStatus.BAD_REQUEST)
        }
        val endTime = stringToLocalTime(dto.endTime) ?: return ResponseEntity(
            "Invalid end time: ${dto.endTime}",
            HttpStatus.BAD_REQUEST
        )
        val eventEntity = Event(name, date, startTime, endTime, user, dto.location, dto.note)

        eventService.saveItem(eventEntity)
        return ResponseEntity("Successfully created a new event", HttpStatus.CREATED)
    }

    override fun updateItem(@RequestBody dto: EventCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val id = dto.id ?: return ResponseEntity("Event id is required", HttpStatus.BAD_REQUEST)
        val eventEntity = eventService.getItem(userId, id) ?: return ResponseEntity(
            "Could not find event with id $id",
            HttpStatus.NOT_FOUND
        )

        dto.name?.let {
            eventEntity.name = it
        }
        dto.date?.let {
            val date = stringToLocalDate(it) ?: return ResponseEntity("Invalid date: $it", HttpStatus.BAD_REQUEST)
            eventEntity.date = date
        }
        dto.startTime?.let {
            val startTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid start time: $it", HttpStatus.BAD_REQUEST)
            eventEntity.startTime = startTime
        }
        dto.endTime?.let {
            val endTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid end time: $it", HttpStatus.BAD_REQUEST)
            eventEntity.endTime = endTime
        }
        dto.location?.let {
            if (it.isBlank()) {
                eventEntity.location = null
            } else {
                eventEntity.location = it
            }
        }
        dto.note?.let {
            if (it.isBlank()) {
                eventEntity.note = null
            } else {
                eventEntity.note = it
            }
        }

        eventService.saveItem(eventEntity)
        return ResponseEntity("Successfully updated event", HttpStatus.OK)
    }
}