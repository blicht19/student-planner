package baileylicht.backend.controllers

import baileylicht.backend.dtos.AssignmentCreateUpdateDto
import baileylicht.backend.dtos.AssignmentResponseDto
import baileylicht.backend.models.Assignment
import baileylicht.backend.repositories.AssignmentRepository
import baileylicht.backend.services.AssignmentService
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.SubjectService
import baileylicht.backend.utilities.stringToLocalDate
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/assignments")
@Tag(name = "Assignments")
class AssignmentController(
    @Autowired private val assignmentService: AssignmentService,
    @Autowired protected val userLoginService: LoginService,
    @Autowired private val subjectService: SubjectService
) : FilterablePlannerItemController<Assignment, AssignmentRepository, AssignmentResponseDto, AssignmentService, AssignmentCreateUpdateDto>(
    assignmentService,
    userLoginService
) {
    override fun createItem(@RequestBody dto: AssignmentCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = dto.name ?: return ResponseEntity("Assignment name is required", HttpStatus.BAD_REQUEST)
        if (dto.dueDate == null) {
            return ResponseEntity("Assignment due date is required", HttpStatus.BAD_REQUEST)
        }
        val dueDate = stringToLocalDate(dto.dueDate) ?: return ResponseEntity(
            "Invalid date: ${dto.dueDate}",
            HttpStatus.BAD_REQUEST
        )

        val assignmentEntity = Assignment(name, dueDate, user = user)
        dto.complete?.let {
            assignmentEntity.complete = it
        }
        dto.subjectId?.let {
            val subject = subjectService.getItem(user.id!!, it)
                ?: return ResponseEntity("Could not find subject matching id $it", HttpStatus.BAD_REQUEST)
            assignmentEntity.subject = subject
        }
        dto.note?.let {
            assignmentEntity.note = it
        }

        assignmentService.saveItem(assignmentEntity)
        return ResponseEntity.ok("Successfully created a new assignment")
    }

    override fun updateItem(@RequestBody dto: AssignmentCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = dto.id ?: return ResponseEntity("Assignment id is required", HttpStatus.BAD_REQUEST)
        val assignmentEntity = assignmentService.getItem(userId, id)
            ?: return ResponseEntity("Could not find assignment with id $id", HttpStatus.NOT_FOUND)

        dto.name?.let {
            assignmentEntity.name = it
        }
        dto.complete?.let {
            assignmentEntity.complete = it
        }
        dto.subjectId?.let {
            if (it < 1) {
                assignmentEntity.subject = null
            } else {
                val subject = subjectService.getItem(userId, it) ?: return ResponseEntity(
                    "Could not find subject matching id $it",
                    HttpStatus.BAD_REQUEST
                )
                assignmentEntity.subject = subject
            }
        }
        dto.note?.let {
            if (it.isBlank()) {
                assignmentEntity.note = null
            } else {
                assignmentEntity.note = it
            }
        }
        dto.dueDate?.let {
            val dueDate =
                stringToLocalDate(it) ?: return ResponseEntity("Invalid date: $it", HttpStatus.BAD_REQUEST)
            assignmentEntity.dueDate = dueDate
        }

        assignmentService.saveItem(assignmentEntity)
        return ResponseEntity.ok("Successfully updated assignment")
    }
}