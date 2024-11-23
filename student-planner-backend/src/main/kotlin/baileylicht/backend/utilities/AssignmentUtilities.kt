package baileylicht.backend.utilities

import baileylicht.backend.dtos.AssignmentResponseDto
import baileylicht.backend.models.Assignment

/**
 * Converts an assignment entity to a DTO to be returned to the client
 * @param assignment The JPA entity representation of an assignment
 * @return The DTO representation of an assignment
 */
fun assignmentToAssignmentResponseDto(assignment: Assignment): AssignmentResponseDto {
    val subject = if (assignment.subject != null) subjectEntityToDto(assignment.subject!!) else null
    return AssignmentResponseDto(
        assignment.name,
        assignment.complete,
        localDateToString(assignment.dueDate),
        subject,
        assignment.note,
        assignment.id
    )
}

/**
 * Converts a list of assignment entities to a list of assignment DTOs
 * @param assignments A List of assignment entities
 * @return A list of assignment DTOs
 */
fun assignmentListToAssignmentResponseDtoList(assignments: List<Assignment>): List<AssignmentResponseDto> {
    return assignments.map { assignmentToAssignmentResponseDto(it) }
}