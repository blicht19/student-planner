package baileylicht.backend.utilities

import baileylicht.backend.dtos.SubjectDto
import baileylicht.backend.models.Subject

/**
 * Converts a subject JPA entity to a DTO to be returned to the client.
 * @param subject The JPA entity representation of a subject
 * @return The DTO representation of a subject
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
        nullableLocalTimeToString(subject.startTime),
        nullableLocalTimeToString(subject.endTime),
        subject.id
    )
}

/**
 * Updates a subject entity's values based on the values in a Subject DTO.
 * Does not update name, as there is separate error checking and handling needed there.
 * @param entity The subject JPA entity
 * @param dto The subject DTO
 * @return An error message if any values in DTO were invalid
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

    if ((entity.startTime != null).xor(entity.endTime != null)) {
        return "Both start and end time must be set together"
    }

    if (entity.startTime != null && entity.endTime != null && entity.startTime!!.isAfter(entity.endTime)) {
        return "Start time must be before end time"
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