package baileylicht.backend.controllers

import baileylicht.backend.dtos.DateRangeDto
import baileylicht.backend.dtos.EventCreateUpdateDto
import baileylicht.backend.models.Event
import baileylicht.backend.services.EventService
import baileylicht.backend.services.LoginService
import baileylicht.backend.utilities.stringToLocalDate
import baileylicht.backend.utilities.stringToLocalTime
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/events")
@Tag(name = "Events")
class EventController(
    @Autowired private val eventService: EventService,
    @Autowired private val loginService: LoginService
) {
    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Retrieves all events for this user")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved events"
        ), ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun getAllEvents(): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val events = eventService.getAll(userId)
        return ResponseEntity.ok(events)
    }

    @PostMapping(
        produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        path = ["range"]
    )
    @Operation(summary = "Gets all events in a range of dates")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved events"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        )]
    )
    fun getAllEventsInDateRange(@RequestBody range: DateRangeDto): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val startDate = stringToLocalDate(range.startDate) ?: return ResponseEntity(
            "Invalid start date: ${range.startDate}",
            HttpStatus.BAD_REQUEST
        )
        if (range.endDate != null) {
            val endDate = stringToLocalDate(range.endDate) ?: return ResponseEntity(
                "Invalid end date: ${range.endDate}",
                HttpStatus.BAD_REQUEST
            )
            return ResponseEntity.ok(eventService.getAllInDateRange(userId, startDate, endDate))
        }

        return ResponseEntity.ok(eventService.getAllOnDate(userId, startDate))
    }

    @PostMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Creates a new event")
    @ApiResponses(
        value = [ApiResponse(responseCode = "201", description = "Successfully created a new event"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        ), ApiResponse(responseCode = "400", description = "Bad request")]
    )
    fun createEvent(@RequestBody event: EventCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = event.name ?: return ResponseEntity("Event name is required", HttpStatus.BAD_REQUEST)
        if (event.date == null) {
            return ResponseEntity("Event date is required", HttpStatus.BAD_REQUEST)
        }
        val date = stringToLocalDate(event.date) ?: return ResponseEntity(
            "invalid date: ${event.date}",
            HttpStatus.BAD_REQUEST
        )
        if (event.startTime == null) {
            return ResponseEntity("Event start time is required", HttpStatus.BAD_REQUEST)
        }
        val startTime = stringToLocalTime(event.startTime) ?: return ResponseEntity(
            "Invalid start time: ${event.startTime}",
            HttpStatus.BAD_REQUEST
        )
        if (event.endTime == null) {
            return ResponseEntity("Event end time is required", HttpStatus.BAD_REQUEST)
        }
        val endTime = stringToLocalTime(event.endTime) ?: return ResponseEntity(
            "Invalid end time: ${event.endTime}",
            HttpStatus.BAD_REQUEST
        )
        val eventEntity = Event(name, date, startTime, endTime, user, event.location, event.note)

        eventService.saveEvent(eventEntity)
        return ResponseEntity("Successfully created a new event", HttpStatus.CREATED)
    }

    @PutMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Updates an event")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully updated event"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        ), ApiResponse(responseCode = "404", description = "No existing event with this id could be found")]
    )
    fun updateEvent(@RequestBody event: EventCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val id = event.id ?: return ResponseEntity("Event id is required", HttpStatus.BAD_REQUEST)
        val eventEntity = eventService.getEvent(userId, id) ?: return ResponseEntity(
            "Could not find event with id $id",
            HttpStatus.NOT_FOUND
        )

        event.name?.let {
            eventEntity.name = it
        }
        event.date?.let {
            val date = stringToLocalDate(it) ?: return ResponseEntity("Invalid date: $it", HttpStatus.BAD_REQUEST)
            eventEntity.date = date
        }
        event.startTime?.let {
            val startTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid start time: $it", HttpStatus.BAD_REQUEST)
            eventEntity.startTime = startTime
        }
        event.endTime?.let {
            val endTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid end time: $it", HttpStatus.BAD_REQUEST)
            eventEntity.endTime = endTime
        }
        event.location?.let {
            if (it.isBlank()) {
                eventEntity.location = null
            } else {
                eventEntity.location = it
            }
        }
        event.note?.let {
            if (it.isBlank()) {
                eventEntity.note = null
            } else {
                eventEntity.note = it
            }
        }

        eventService.saveEvent(eventEntity)
        return ResponseEntity("Successfully updated event", HttpStatus.OK)
    }

    @DeleteMapping(produces = [MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Deletes an event")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully deleted an event"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "404",
            description = "Event not found"
        )]
    )
    fun deleteEvent(@RequestParam("id") eventId: Long): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val deletedCount = eventService.deleteEvent(userId, eventId)
        if (deletedCount > 0) {
            return ResponseEntity.ok().body("Successfully deleted an event")
        }

        return ResponseEntity("Could not find event with id $eventId", HttpStatus.NOT_FOUND)
    }
}