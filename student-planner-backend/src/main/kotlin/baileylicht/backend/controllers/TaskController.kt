package baileylicht.backend.controllers

import baileylicht.backend.dtos.TaskCreateUpdateDto
import baileylicht.backend.dtos.TaskResponseDto
import baileylicht.backend.models.Task
import baileylicht.backend.repositories.TaskRepository
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.TaskService
import baileylicht.backend.utilities.stringToLocalDate
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/tasks")
@Tag(name = "Tasks")
class TaskController(
    @Autowired private val taskService: TaskService,
    @Autowired private val userLoginService: LoginService
) : FilterablePlannerItemController<Task, TaskRepository, TaskResponseDto, TaskService, TaskCreateUpdateDto>(
    taskService,
    userLoginService
) {
    override fun createItem(@RequestBody dto: TaskCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = dto.name ?: return ResponseEntity("Task name is required", HttpStatus.BAD_REQUEST)
        if (dto.dueDate == null) {
            return ResponseEntity("Task due date is required", HttpStatus.BAD_REQUEST)
        }
        val dueDate = stringToLocalDate(dto.dueDate) ?: return ResponseEntity(
            "Invalid date: ${dto.dueDate}",
            HttpStatus.BAD_REQUEST
        )

        val taskEntity = Task(name, dueDate, user = user)
        dto.complete?.let {
            taskEntity.complete = it
        }
        dto.note?.let {
            taskEntity.note = it
        }

        taskService.saveItem(taskEntity)
        return ResponseEntity.ok("Successfully created a new task")
    }

    override fun updateItem(@RequestBody dto: TaskCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = dto.id ?: return ResponseEntity("Task id is required", HttpStatus.BAD_REQUEST)
        val taskEntity = taskService.getItem(userId, id) ?: return ResponseEntity(
            "Could not find task with id $id",
            HttpStatus.NOT_FOUND
        )

        dto.name?.let {
            taskEntity.name = it
        }
        dto.complete?.let {
            taskEntity.complete = it
        }
        dto.note?.let {
            if (it.isBlank()) {
                taskEntity.note = null
            } else {
                taskEntity.note = it
            }
        }
        dto.dueDate?.let {
            val dueDate =
                stringToLocalDate(dto.dueDate) ?: return ResponseEntity("Invalid date", HttpStatus.BAD_REQUEST)
            taskEntity.dueDate = dueDate
        }

        taskService.saveItem(taskEntity)
        return ResponseEntity.ok("Successfully updated task")
    }
}