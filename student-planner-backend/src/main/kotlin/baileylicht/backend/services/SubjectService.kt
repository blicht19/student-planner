package baileylicht.backend.services

import baileylicht.backend.dtos.SubjectDto
import baileylicht.backend.models.Subject
import baileylicht.backend.repositories.SubjectRepository
import baileylicht.backend.utilities.subjectEntityListToDtoList
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class SubjectService(@Autowired private val subjectRepository: SubjectRepository) {
    /**
     * Returns all subjects for a user
     * @param userId The ID number of the user
     * @return A list of subjects for this user
     */
    fun getAll(userId: Long): List<SubjectDto> {
        val subjects = subjectRepository.findAllByUserId(userId)
        return subjectEntityListToDtoList(subjects)
    }

    /**
     * Retrieves a subject entity for the given user ID and subject ID
     * @param userId The ID number of a user
     * @param id The ID number of a subject
     * @return The subject with the matching user ID and ID, null if none could be found
     */
    fun getSubject(userId: Long, id: Long): Subject? {
        return subjectRepository.findByUserIdAndId(userId, id)
    }

    /**
     * Returns DTOs for all subjects on a day of the week for a user
     * @param userId The ID number of the user
     * @param dayOfWeek The index of the day of the week, 0 being Sunday, 6 being Saturday
     * @return A list of subjects on the given day of the week for the user
     */
    fun getAllOnDay(userId: Long, dayOfWeek: Int): List<SubjectDto> {
        return when (dayOfWeek) {
            0 -> subjectEntityListToDtoList(subjectRepository.findAllByUserIdAndSundayIsTrue(userId))
            1 -> subjectEntityListToDtoList(subjectRepository.findAllByUserIdAndMondayIsTrue(userId))
            2 -> subjectEntityListToDtoList(subjectRepository.findAllByUserIdAndTuesdayIsTrue(userId))
            3 -> subjectEntityListToDtoList(subjectRepository.findAllByUserIdAndWednesdayIsTrue(userId))
            4 -> subjectEntityListToDtoList(subjectRepository.findAllByUserIdAndThursdayIsTrue(userId))
            5 -> subjectEntityListToDtoList(subjectRepository.findAllByUserIdAndFridayIsTrue(userId))
            6 -> subjectEntityListToDtoList(subjectRepository.findAllByUserIdAndSaturdayIsTrue(userId))
            else -> emptyList()
        }
    }

    /**
     * Saves a subject to the database
     * @param subject A subject entity
     */
    fun saveSubject(subject: Subject) {
        subjectRepository.save(subject)
    }

    /**
     * Deletes a subject with the matching ID for a user
     * @param userId The ID number of the user
     * @param id The ID number of the subject to delete
     * @return The number of subjects deleted
     */
    @Transactional
    fun deleteSubject(userId: Long, id: Long): Long {
        return subjectRepository.deleteByUserIdAndId(userId, id)
    }
}