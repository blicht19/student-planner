package baileylicht.backend.controllers

import baileylicht.backend.dtos.AssignmentCreateUpdateDto
import baileylicht.backend.dtos.AssignmentFilterDto
import baileylicht.backend.models.Assignment
import baileylicht.backend.services.AssignmentService
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.SubjectService
import baileylicht.backend.utilities.stringToLocalDate
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/assignments")
@Tag(name = "Assignments")
class AssignmentController(
    @Autowired private val assignmentService: AssignmentService,
    @Autowired private val loginService: LoginService,
    @Autowired private val subjectService: SubjectService
) {
    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Retrieves all assignments for this user")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved assignments"
        ), ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun getAllAssignments(): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val assignments = assignmentService.getAll(userId)
        return ResponseEntity.ok(assignments)
    }

    @PostMapping(
        produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        path = ["filter"]
    )
    @Operation(summary = "Gets all assignments filtered by completion state and due date")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved assignments"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        )]
    )
    fun getAllAssignmentsFiltered(@RequestBody filter: AssignmentFilterDto): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val assignments = assignmentService.getAllFiltered(userId, filter.completed)
        return ResponseEntity.ok(assignments)
    }

    @PostMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Creates a new assignment")
    @ApiResponses(
        value = [ApiResponse(responseCode = "201", description = "Successfully created a new assignment"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        ), ApiResponse(responseCode = "400", description = "Bad request")]
    )
    fun createAssignment(@RequestBody assignment: AssignmentCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = assignment.name ?: return ResponseEntity("Assignment name is required", HttpStatus.BAD_REQUEST)

        val assignmentEntity = Assignment(name, user = user)
        assignment.complete?.let {
            assignmentEntity.complete = it
        }
        assignment.subjectId?.let {
            val subject = subjectService.getSubject(user.id!!, it)
                ?: return ResponseEntity("Could not find subject matching id $it", HttpStatus.BAD_REQUEST)
            assignmentEntity.subject = subject
        }
        assignment.note?.let {
            assignmentEntity.note = it
        }
        assignment.dueDate?.let {
            val dueDate = stringToLocalDate(it) ?: return ResponseEntity("Invalid date: $it", HttpStatus.BAD_REQUEST)
            assignmentEntity.dueDate = dueDate
        }

        assignmentService.saveAssignment(assignmentEntity)
        return ResponseEntity.ok("Successfully created a new assignment")
    }

    @PutMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Updates an assignment")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully updated assignment"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        ), ApiResponse(responseCode = "404", description = "No existing assignment with this id could be found")]
    )
    fun updateAssignment(@RequestBody assignment: AssignmentCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = assignment.id ?: return ResponseEntity("Assignment id is required", HttpStatus.BAD_REQUEST)
        val assignmentEntity = assignmentService.getAssignment(userId, id)
            ?: return ResponseEntity("Could not find assignment with id $id", HttpStatus.NOT_FOUND)

        assignment.name?.let {
            assignmentEntity.name = it
        }
        assignment.complete?.let {
            assignmentEntity.complete = it
        }
        assignment.subjectId?.let {
            if (it < 1) {
                assignmentEntity.subject = null
            } else {
                val subject = subjectService.getSubject(userId, it) ?: return ResponseEntity(
                    "Could not find subject matching id $it",
                    HttpStatus.BAD_REQUEST
                )
                assignmentEntity.subject = subject
            }
        }
        assignment.note?.let {
            if (it.isBlank()) {
                assignmentEntity.note = null
            } else {
                assignmentEntity.note = it
            }
        }
        assignment.dueDate?.let {
            if (it.isBlank()) {
                assignmentEntity.dueDate = null
            } else {
                val dueDate =
                    stringToLocalDate(it) ?: return ResponseEntity("Invalid date: $it", HttpStatus.BAD_REQUEST)
                assignmentEntity.dueDate = dueDate
            }
        }

        assignmentService.saveAssignment(assignmentEntity)
        return ResponseEntity.ok("Successfully updated assignment")
    }

    @DeleteMapping(produces = [MediaType.TEXT_PLAIN_VALUE])
    @Operation(description = "Deletes an assignment")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully deleted an assignment"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "404",
            description = "Assignment not found"
        )]
    )
    fun deleteAssignment(@RequestParam("id") assignmentId: Long): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val deletedCount = assignmentService.deleteAssignment(userId, assignmentId)
        if (deletedCount > 0) {
            return ResponseEntity.ok().body("Successfully deleted an assignment")
        }

        return ResponseEntity("Could not find an assignment matching id $assignmentId", HttpStatus.NOT_FOUND)
    }
}