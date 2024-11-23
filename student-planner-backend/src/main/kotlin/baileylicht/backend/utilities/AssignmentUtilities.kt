package baileylicht.backend.utilities

import baileylicht.backend.dtos.AssignmentResponseDto
import baileylicht.backend.models.Assignment
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

private val dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy")

fun localDateToString(date: LocalDate?): String? {
    if (date == null) return null

    return dateFormatter.format(date)
}

fun stringToLocalDate(value: String): LocalDate? {
    return try {
        LocalDate.parse(value, dateFormatter)
    } catch (e: DateTimeParseException) {
        null
    }
}

fun assignmentToAssignmentResponseDto(assignment: Assignment): AssignmentResponseDto {
    val subject = if (assignment.subject != null) subjectEntityToDto(assignment.subject!!) else null
    return AssignmentResponseDto(
        assignment.name,
        assignment.complete,
        subject,
        assignment.note,
        localDateToString(assignment.dueDate),
        assignment.id
    )
}

fun assignmentListToAssignmentResponseDtoList(assignments: List<Assignment>): List<AssignmentResponseDto> {
    return assignments.map { assignmentToAssignmentResponseDto(it) }
}