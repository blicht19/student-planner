package baileylicht.backend.services

import baileylicht.backend.dtos.ExamResponseDto
import baileylicht.backend.models.Exam
import baileylicht.backend.repositories.ExamRepository
import baileylicht.backend.utilities.localDateToString
import baileylicht.backend.utilities.localTimeToString
import baileylicht.backend.utilities.subjectEntityToDto
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

/**
 * Converts an exam entity to a DTO to be returned to the client
 * @param exam The JPA entity representation of an exam
 * @return The DTO representation of an exam
 */
private fun examToExamResponseDto(exam: Exam): ExamResponseDto {
    val subject = if (exam.subject != null) subjectEntityToDto(exam.subject!!) else null
    return ExamResponseDto(
        exam.name,
        localDateToString(exam.date),
        localTimeToString(exam.startTime),
        localTimeToString(exam.endTime),
        subject,
        exam.location,
        exam.note,
        exam.id
    )
}

@Service
class ExamService(@Autowired private val examRepository: ExamRepository) :
    DateRangePlannerItemService<Exam, ExamRepository, ExamResponseDto>(examRepository) {
    override fun convertEntitiesToResponseDtos(entities: List<Exam>): List<ExamResponseDto> {
        return entities.map { examToExamResponseDto(it) }
    }

    override fun findAllEntitiesByUserId(userId: Long): List<Exam> {
        return examRepository.findAllByUserId(userId)
    }

    override fun getItem(userId: Long, id: Long): Exam? {
        return examRepository.findByUserIdAndId(userId, id)
    }

    @Transactional
    override fun deleteItem(userId: Long, id: Long): Long {
        return examRepository.deleteByUserIdAndId(userId, id)
    }

    override fun findAllEntitiesInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Exam> {
        return examRepository.findAllInDateRange(userId, startDate, endDate)
    }
}