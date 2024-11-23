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
    fun getAll(userId: Long): List<AssignmentResponseDto> {
        val assignments = assignmentRepository.findAllByUserId(userId)
        return assignmentListToAssignmentResponseDtoList(assignments)
    }

    fun getAllFiltered(
        userId: Long,
        completed: Boolean,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<AssignmentResponseDto> {
        val assignments = assignmentRepository.findAllFiltered(userId, completed, startDate, endDate)
        return assignmentListToAssignmentResponseDtoList(assignments)
    }

    fun getAssignment(userId: Long, assignmentId: Long): Assignment? {
        return assignmentRepository.findByUserIdAndId(userId, assignmentId)
    }

    fun saveAssignment(assignment: Assignment) {
        assignmentRepository.save(assignment)
    }

    @Transactional
    fun deleteAssignment(userId: Long, assignmentId: Long): Long {
        return assignmentRepository.deleteByUserIdAndId(userId, assignmentId)
    }
}