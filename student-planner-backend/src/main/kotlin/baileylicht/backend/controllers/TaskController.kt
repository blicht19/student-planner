package baileylicht.backend.controllers

import baileylicht.backend.dtos.DueDateFilterDto
import baileylicht.backend.dtos.TaskCreateUpdateDto
import baileylicht.backend.models.Task
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.TaskService
import baileylicht.backend.utilities.stringToLocalDate
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tasks")
@Tag(name = "Tasks")
class TaskController(
    @Autowired private val taskService: TaskService,
    @Autowired private val loginService: LoginService
) {
    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Retrieves all tasks for this user")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved tasks"
        ), ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun getAllTasks(): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val tasks = taskService.getAll(userId)
        return ResponseEntity.ok(tasks)
    }

    @PostMapping(
        produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        path = ["filter"]
    )
    @Operation(summary = "Gets all tasks filtered by completion state and due date")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved tasks"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        )]
    )
    fun getAllTasksFiltered(@RequestBody filter: DueDateFilterDto): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val startDate =
            stringToLocalDate(filter.startDate) ?: return ResponseEntity("Invalid start date", HttpStatus.BAD_REQUEST)
        val endDate =
            stringToLocalDate(filter.endDate) ?: return ResponseEntity("Invalid end date", HttpStatus.BAD_REQUEST)

        val tasks = taskService.getAllFiltered(userId, filter.showCompleted, startDate, endDate)
        return ResponseEntity.ok(tasks)
    }

    @PostMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Creates a new task")
    @ApiResponses(
        value = [ApiResponse(responseCode = "201", description = "Successfully created a new task"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        ), ApiResponse(responseCode = "400", description = "Bad request")]
    )
    fun createTask(@RequestBody task: TaskCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = task.name ?: return ResponseEntity("Task name is required", HttpStatus.BAD_REQUEST)
        if (task.dueDate == null) {
            return ResponseEntity("Task due date is required", HttpStatus.BAD_REQUEST)
        }
        val dueDate = stringToLocalDate(task.dueDate) ?: return ResponseEntity(
            "Invalid date: ${task.dueDate}",
            HttpStatus.BAD_REQUEST
        )

        val taskEntity = Task(name, dueDate, user = user)
        task.complete?.let {
            taskEntity.complete = it
        }
        task.note?.let {
            taskEntity.note = it
        }

        taskService.saveTask(taskEntity)
        return ResponseEntity.ok("Successfully created a new task")
    }

    @PutMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Updates an task")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully updated task"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        ), ApiResponse(responseCode = "404", description = "No existing task with this id could be found")]
    )
    fun updateTask(@RequestBody task: TaskCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = task.id ?: return ResponseEntity("Task id is required", HttpStatus.BAD_REQUEST)
        val taskEntity = taskService.getTask(userId, id) ?: return ResponseEntity(
            "Could not find task with id $id",
            HttpStatus.NOT_FOUND
        )

        task.name?.let {
            taskEntity.name = it
        }
        task.complete?.let {
            taskEntity.complete = it
        }
        task.note?.let {
            if (it.isBlank()) {
                taskEntity.note = null
            } else {
                taskEntity.note = it
            }
        }
        task.dueDate?.let {
            val dueDate =
                stringToLocalDate(task.dueDate) ?: return ResponseEntity("Invalid date", HttpStatus.BAD_REQUEST)
            taskEntity.dueDate = dueDate
        }

        taskService.saveTask(taskEntity)
        return ResponseEntity.ok("Successfully updated task")
    }

    @DeleteMapping(produces = [MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Deletes a task")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully deleted a task"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "404",
            description = "Task not found"
        )]
    )
    fun deleteTask(@RequestParam("id") taskId: Long): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val deletedCount = taskService.deleteTask(userId, taskId)
        if (deletedCount > 0) {
            return ResponseEntity.ok().body("Successfully deleted a task")
        }

        return ResponseEntity("Could not find a task with matching id $taskId", HttpStatus.NOT_FOUND)
    }
}