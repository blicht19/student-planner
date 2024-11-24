package baileylicht.backend.services

import baileylicht.backend.dtos.ExamResponseDto
import baileylicht.backend.models.Exam
import baileylicht.backend.repositories.ExamRepository
import baileylicht.backend.utilities.examListToExamResponseDtoList
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

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
     * Returns all exams for this user from startDate to endDate, inclusive
     * @param userId The ID number for a user
     * @param startDate The start of the range of assignment dates to return
     * @param endDate The end of the range of assignment dates to return
     * @return All assignments for this user on dates between startDate and endDate, inclusive
     */
    fun getAllInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<ExamResponseDto> {
        val exams = examRepository.findAllInDateRange(userId, startDate, endDate)
        return examListToExamResponseDtoList(exams)
    }

    /**
     * Returns all exams for this user on a date
     * @param userId The ID number for a user
     * @param date The date to check for exams
     * @return All exams for the given user on the given date
     */
    fun getAllOnDate(userId: Long, date: LocalDate): List<ExamResponseDto> {
        return getAllInDateRange(userId, date, date)
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