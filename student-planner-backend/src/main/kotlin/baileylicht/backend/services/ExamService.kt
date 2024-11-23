package baileylicht.backend.services

import baileylicht.backend.dtos.ExamResponseDto
import baileylicht.backend.models.Exam
import baileylicht.backend.repositories.ExamRepository
import baileylicht.backend.utilities.examListToExamResponseDtoList
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ExamService(@Autowired private val examRepository: ExamRepository) {
    /**
     * Returns all exams for a user
     * @param userId The ID number of the user
     * @return A list of exams for this user
     */
    fun getAll(userId: Long): List<ExamResponseDto> {
        val exams = examRepository.findAllByUserId(userId)
        return examListToExamResponseDtoList(exams)
    }

    /**
     * Retrieves an exam entity for the given user ID and exam ID
     * @param userId The ID number of user
     * @param examId The ID number of an exam
     * @return The exam with the matching user ID and ID, null if none could be found
     */
    fun getExam(userId: Long, examId: Long): Exam? {
        return examRepository.findByUserIdAndId(userId, examId)
    }

    /**
     * Saves an exam to the database
     * @param exam An exam entity
     */
    fun saveExam(exam: Exam) {
        examRepository.save(exam)
    }

    /**
     * Deletes an exam with the matching user ID and exam ID
     * @param userId The ID number of the user
     * @param examId The ID number of the exam to delete
     * @return The number of exams deleted
     */
    @Transactional
    fun deleteExam(userId: Long, examId: Long): Long {
        return examRepository.deleteByUserIdAndId(userId, examId)
    }
}