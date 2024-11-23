package baileylicht.backend.services

import baileylicht.backend.dtos.AssignmentResponseDto
import baileylicht.backend.models.Assignment
import baileylicht.backend.repositories.AssignmentRepository
import baileylicht.backend.utilities.assignmentListToAssignmentResponseDtoList
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class AssignmentService(@Autowired private val assignmentRepository: AssignmentRepository) {
    /**
     * Returns all assignments for a user
     * @param userId The ID number of the user
     * @return A list of assignments for this user
     */
    fun getAll(userId: Long): List<AssignmentResponseDto> {
        val assignments = assignmentRepository.findAllByUserId(userId)
        return assignmentListToAssignmentResponseDtoList(assignments)
    }

    /**
     * Returns all assignments for a user filtered by completion and due date range
     * @param userId The ID number for a user
     * @param showCompleted Indicates whether completed assignments should be returned
     * @param startDate The start of the range of assignment due dates to return, inclusive
     * @param endDate The end of the range of assignment due dates to return, inclusive
     * @return All assignments with a due date on or after startDate and on or after endDate,
     * with completed assignments filtered out if showCompleted is false
     */
    fun getAllFiltered(
        userId: Long,
        showCompleted: Boolean,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<AssignmentResponseDto> {
        val assignments = if (showCompleted) {
            assignmentRepository.findAllInDateRange(userId, startDate, endDate)
        } else {
            assignmentRepository.findAllIncompleteInDateRange(userId, startDate, endDate)
        }
        return assignmentListToAssignmentResponseDtoList(assignments)
    }

    /**
     * Retrieves an assignment entity for the given user ID and assignment ID
     * @param userId The ID number of a user
     * @param assignmentId The ID number of an assignment
     * @return The assignment with the matching user ID and ID, null if none could be found
     */
    fun getAssignment(userId: Long, assignmentId: Long): Assignment? {
        return assignmentRepository.findByUserIdAndId(userId, assignmentId)
    }

    /**
     * Saves an assignment to the database
     * @param assignment An assignment entity
     */
    fun saveAssignment(assignment: Assignment) {
        assignmentRepository.save(assignment)
    }

    /**
     * Deletes an assignment with the matching ID for a user
     * @param userId The ID number of the user
     * @param assignmentId The ID number of the assignment to delete
     * @return The number of assignments deleted
     */
    @Transactional
    fun deleteAssignment(userId: Long, assignmentId: Long): Long {
        return assignmentRepository.deleteByUserIdAndId(userId, assignmentId)
    }
}