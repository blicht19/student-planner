package baileylicht.backend.utilities

import baileylicht.backend.dtos.ExamResponseDto
import baileylicht.backend.models.Exam

/**
 * Converts an exam entity to a DTO to be returned to the client
 * @param exam The JPA entity representation of an exam
 * @return The DTO representation of an exam
 */
fun examToExamResponseDto(exam: Exam): ExamResponseDto {
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

/**
 * Converts a list of exam entities to a list of exam DTOs
 */
fun examListToExamResponseDtoList(exams: List<Exam>): List<ExamResponseDto> {
    return exams.map { examToExamResponseDto(it) }
}