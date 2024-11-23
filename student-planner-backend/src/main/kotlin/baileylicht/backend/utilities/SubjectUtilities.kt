package baileylicht.backend.utilities

import baileylicht.backend.dtos.SubjectDto
import baileylicht.backend.models.Subject
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

private val timeFormatter = DateTimeFormatter.ofPattern("hh:mm a")

/**
 * Formats a LocalTime as a String in the format HH:MM AM|PM
 * @param localTime A LocalTime
 * @return The String representation of localTime. Returns null if localTime is null
 */
fun localTimeToString(localTime: LocalTime?): String? {
    if (localTime == null) {
        return null
    }

    return timeFormatter.format(localTime)
}

/**
 * Attempts to parse a String into a LocalTime
 * @param value The String to be parsed into a LocalTime
 * @return The LocalTime created by parsing this String. Returns null if the String could not be parsed.
 */
fun stringToLocalTime(value: String): LocalTime? {
    return try {
        LocalTime.parse(value, timeFormatter)
    } catch (e: DateTimeParseException) {
        null
    }
}

/**
 * Converts a Subject JPA entity to a DTO to be returned to the client.
 * @param subject The JPA entity representation of a Subject
 * @return The DTO representation of a Subject
 */
fun subjectEntityToDto(subject: Subject): SubjectDto {
    return SubjectDto(
        subject.name,
        subject.location,
        subject.monday,
        subject.tuesday,
        subject.wednesday,
        subject.thursday,
        subject.friday,
        subject.saturday,
        subject.sunday,
        localTimeToString(subject.startTime),
        localTimeToString(subject.endTime),
        subject.id
    )
}

/**
 * Converts a List of Subject JPA entities to a List of Subject DTOs
 * @param entities A list of Subject JPA entities
 * @return A list of Subject DTOs
 */
fun subjectEntityListToDtoList(entities: List<Subject>): List<SubjectDto> {
    return entities.map { subjectEntityToDto(it) }
}

/**
 * Updates a Subject entities values based on the values in a Subject DTO. Does not update name, as there is separate error checking and handling needed there.
 * @param entity The Subject JPA entity
 * @param dto The Subject DTO
 * @return An error message if any values in dto were invalid
 */
fun updateSubjectEntityFromDto(entity: Subject, dto: SubjectDto): String? {
    dto.startTime?.let {
        if (it.isBlank()) {
            entity.startTime = null
        } else {
            entity.startTime =
                stringToLocalTime(it) ?: return "Invalid start time: $it Start time must be of format HH:MM AM|PM"
        }
    }
    dto.endTime?.let {
        if (it.isBlank()) {
            entity.endTime = null
        } else {
            entity.endTime =
                stringToLocalTime(it) ?: return "Invalid end time $it End time must be of format HH:MM AM|PM"
        }
    }
    dto.location?.let {
        if (it.isBlank()) {
            entity.location = null
        } else {
            entity.location = it
        }
    }

    dto.sunday?.let {
        entity.sunday = it
    }
    dto.monday?.let {
        entity.monday = it
    }
    dto.tuesday?.let {
        entity.tuesday = it
    }
    dto.wednesday?.let {
        entity.wednesday = it
    }
    dto.thursday?.let {
        entity.thursday = it
    }
    dto.friday?.let {
        entity.friday = it
    }
    dto.saturday?.let {
        entity.saturday = it
    }

    return null
}