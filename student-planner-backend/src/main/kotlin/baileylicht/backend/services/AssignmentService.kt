package baileylicht.backend.services

import baileylicht.backend.dtos.AssignmentResponseDto
import baileylicht.backend.models.Assignment
import baileylicht.backend.repositories.AssignmentRepository
import baileylicht.backend.utilities.localDateToString
import baileylicht.backend.utilities.subjectEntityToDto
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

/**
 * Converts an assignment entity to a DTO to be returned to the client
 * @param assignment The JPA entity representation of an assignment
 * @return The DTO representation of an assignment
 */
private fun assignmentToAssignmentResponseDto(assignment: Assignment): AssignmentResponseDto {
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

@Service
class AssignmentService(
    @Autowired private val assignmentRepository: AssignmentRepository
) :
    FilterablePlannerItemService<Assignment, AssignmentRepository, AssignmentResponseDto>(assignmentRepository) {
    override fun convertEntitiesToResponseDtos(entities: List<Assignment>): List<AssignmentResponseDto> {
        return entities.map { assignmentToAssignmentResponseDto(it) }
    }

    override fun findAllEntitiesByUserId(userId: Long): List<Assignment> {
        return assignmentRepository.findAllByUserId(userId)
    }

    override fun getItem(userId: Long, id: Long): Assignment? {
        return assignmentRepository.findByUserIdAndId(userId, id)
    }

    @Transactional
    override fun deleteItem(userId: Long, id: Long): Long {
        return assignmentRepository.deleteByUserIdAndId(userId, id)
    }

    override fun findAllEntitiesInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Assignment> {
        return assignmentRepository.findAllInDateRange(userId, startDate, endDate)
    }

    override fun findAllIncompleteEntitiesInDateRange(
        userId: Long,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<Assignment> {
        return assignmentRepository.findAllIncompleteInDateRange(userId, startDate, endDate)
    }
}