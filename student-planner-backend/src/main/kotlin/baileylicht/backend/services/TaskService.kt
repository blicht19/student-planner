package baileylicht.backend.services

import baileylicht.backend.dtos.TaskResponseDto
import baileylicht.backend.models.Task
import baileylicht.backend.repositories.TaskRepository
import baileylicht.backend.utilities.localDateToString
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

/**
 * Converts a task entity to a DTO to be returned to the client
 * @param task The JPA entity representation of a task
 * @return The DTO representation of a task
 */
private fun taskToTaskResponseDto(task: Task): TaskResponseDto {
    return TaskResponseDto(task.name, task.complete, localDateToString(task.dueDate), task.note, task.id)
}

@Service
class TaskService(@Autowired private val taskRepository: TaskRepository) :
    FilterablePlannerItemService<Task, TaskRepository, TaskResponseDto>(taskRepository) {
    override fun convertEntitiesToResponseDtos(entities: List<Task>): List<TaskResponseDto> {
        return entities.map { task -> taskToTaskResponseDto(task) }
    }

    override fun findAllEntitiesByUserId(userId: Long): List<Task> {
        return taskRepository.findAllByUserId(userId)
    }

    override fun getItem(userId: Long, id: Long): Task? {
        return taskRepository.findByUserIdAndId(userId, id)
    }

    @Transactional
    override fun deleteItem(userId: Long, id: Long): Long {
        return taskRepository.deleteByUserIdAndId(userId, id)
    }

    override fun findAllEntitiesInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<Task> {
        return taskRepository.findAllInDateRange(userId, startDate, endDate)
    }

    override fun findAllIncompleteEntitiesInDateRange(
        userId: Long,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<Task> {
        return taskRepository.findAllIncompleteInDateRange(userId, startDate, endDate)
    }
}