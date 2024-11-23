package baileylicht.backend.utilities

import baileylicht.backend.dtos.TaskResponseDto
import baileylicht.backend.models.Task

/**
 * Converts a task entity to a DTO to be returned to the client
 * @param task The JPA entity representation of a task
 * @return The DTO representation of a task
 */
fun taskToTaskResponseDto(task: Task): TaskResponseDto {
    return TaskResponseDto(task.name, task.complete, localDateToString(task.dueDate), task.note, task.id)
}

/**
 * Converts a list of task entities to a list of task DTOs
 * @param tasks A list of task entities
 * @return A list of task DTOs
 */
fun taskListToTaskResponseDtoList(tasks: List<Task>): List<TaskResponseDto> {
    return tasks.map { task -> taskToTaskResponseDto(task) }
}