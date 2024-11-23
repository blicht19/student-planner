package baileylicht.backend.services

import baileylicht.backend.dtos.TaskResponseDto
import baileylicht.backend.models.Task
import baileylicht.backend.repositories.TaskRepository
import baileylicht.backend.utilities.taskListToTaskResponseDtoList
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class TaskService(@Autowired private val taskRepository: TaskRepository) {
    /**
     * Return all tasks for a user
     * @param userId The ID number of the task
     * @return A list of tasks for this user
     */
    fun getAll(userId: Long): List<TaskResponseDto> {
        val tasks = taskRepository.findAllByUserId(userId)
        return taskListToTaskResponseDtoList(tasks)
    }

    /**
     * Returns all tasks for a user filtered by completion and due date range
     * @param userId The ID number for a user
     * @param showCompleted Indicates whether completed tasks should be returned
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
    ): List<TaskResponseDto> {
        val tasks = if (showCompleted) {
            taskRepository.findAllInDateRange(userId, startDate, endDate)
        } else {
            taskRepository.findAllIncompleteInDateRange(userId, startDate, endDate)
        }
        return taskListToTaskResponseDtoList(tasks)
    }

    /**
     * Retrieves a task entity for the given user ID and task ID
     * @param userId The ID number of a user
     * @param taskId The ID number of a task
     * @return The task with the matching user ID and ID, null if none could be found
     */
    fun getTask(userId: Long, taskId: Long): Task? {
        return taskRepository.findByUserIdAndId(userId, taskId)
    }

    /**
     * Saves a task to the database
     * @param task A task entity
     */
    fun saveTask(task: Task) {
        taskRepository.save(task)
    }

    /**
     * Deletes a task with the matching user ID and task ID
     * @param userId The ID number of the user
     * @param taskId The ID number of the task to delete
     * @return The number of tasks deleted
     */
    @Transactional
    fun deleteTask(userId: Long, taskId: Long): Long {
        return taskRepository.deleteByUserIdAndId(userId, taskId)
    }
}