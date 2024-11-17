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
     * Returns DTOs for all Subjects for a User
     * @param userId The ID number of the User
     * @return A list of Subjects for this User
     */
    fun getAll(userId: Long): List<SubjectDto> {
        val subjects = subjectRepository.findAllByUserId(userId)
        return subjectEntityListToDtoList(subjects)
    }

    /**
     * Retrieves a Subject entity for the given User ID and Subject ID
     * @param userId The ID number of a User
     * @param id The ID number of a Subject
     * @return The Subject with the matching User ID and ID. null if none could be found
     */
    fun getSubject(userId: Long, id: Long): Subject? {
        return subjectRepository.findByUserIdAndId(userId, id)
    }

    /**
     * Returns DTOs for all Subjects on a day of the week for a User
     * @param userId The ID number of the User
     * @param dayOfWeek The index of the day of the week, 0 being Sunday, 6 being Saturday
     * @return A list of DTOs for Subjects on the given day of the week for the User
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
     * Saves a Subject to the database
     * @param subject A Subject entity
     */
    fun saveSubject(subject: Subject) {
        subjectRepository.save(subject)
    }

    /**
     * Deletes a subject with the matching id for a User
     * @param userId The ID number of the User
     * @param id The ID number of the Subject to delete
     * @return The number of Subjects deleted
     */
    @Transactional
    fun deleteSubject(userId: Long, id: Long): Long {
        return subjectRepository.deleteByUserIdAndId(userId, id)
    }
}