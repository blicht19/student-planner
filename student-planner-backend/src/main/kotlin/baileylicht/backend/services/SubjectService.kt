package baileylicht.backend.services

import baileylicht.backend.dtos.SubjectDto
import baileylicht.backend.models.Subject
import baileylicht.backend.repositories.SubjectRepository
import baileylicht.backend.utilities.subjectEntityToDto
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class SubjectService(@Autowired private val subjectRepository: SubjectRepository) :
    PlannerItemService<Subject, SubjectRepository, SubjectDto>(subjectRepository) {
    override fun convertEntitiesToResponseDtos(entities: List<Subject>): List<SubjectDto> {
        return entities.map { subjectEntityToDto(it) }
    }

    override fun findAllEntitiesByUserId(userId: Long): List<Subject> {
        return subjectRepository.findAllByUserId(userId)
    }

    override fun getItem(userId: Long, id: Long): Subject? {
        return subjectRepository.findByUserIdAndId(userId, id)
    }

    @Transactional
    override fun deleteItem(userId: Long, id: Long): Long {
        return subjectRepository.deleteByUserIdAndId(userId, id)
    }

    /**
     * Returns DTOs for all subjects on a day of the week for a user
     * @param userId The ID number of the user
     * @param dayOfWeek The index of the day of the week, 0 being Sunday, 6 being Saturday
     * @return A list of subjects on the given day of the week for the user
     */
    fun getAllOnDay(userId: Long, dayOfWeek: Int): List<SubjectDto> {
        return when (dayOfWeek) {
            0 -> convertEntitiesToResponseDtos(subjectRepository.findAllByUserIdAndSundayIsTrue(userId))
            1 -> convertEntitiesToResponseDtos(subjectRepository.findAllByUserIdAndMondayIsTrue(userId))
            2 -> convertEntitiesToResponseDtos(subjectRepository.findAllByUserIdAndTuesdayIsTrue(userId))
            3 -> convertEntitiesToResponseDtos(subjectRepository.findAllByUserIdAndWednesdayIsTrue(userId))
            4 -> convertEntitiesToResponseDtos(subjectRepository.findAllByUserIdAndThursdayIsTrue(userId))
            5 -> convertEntitiesToResponseDtos(subjectRepository.findAllByUserIdAndFridayIsTrue(userId))
            6 -> convertEntitiesToResponseDtos(subjectRepository.findAllByUserIdAndSaturdayIsTrue(userId))
            else -> emptyList()
        }
    }
}