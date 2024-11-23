package baileylicht.backend.controllers

import baileylicht.backend.dtos.SubjectDto
import baileylicht.backend.models.Subject
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.SubjectService
import baileylicht.backend.utilities.updateSubjectEntityFromDto
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
@RequestMapping("/subjects")
@Tag(name = "Subjects")
class SubjectController(
    @Autowired private val subjectService: SubjectService,
    @Autowired private val loginService: LoginService
) {
    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Retrieves all subjects for this user")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved subjects"
        ), ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun getAllSubjects(): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val subjects = subjectService.getAll(userId)
        return ResponseEntity.ok(subjects)
    }

    @PostMapping(
        produces = [MediaType.TEXT_PLAIN_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    @Operation(summary = "Creates a new subject")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "201",
            description = "Created new subject"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        ),
            ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun createSubject(@RequestBody subject: SubjectDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = subject.name ?: return ResponseEntity("Subject name is required", HttpStatus.BAD_REQUEST)

        val subjectEntity = Subject(name, user)
        val errorMessage = updateSubjectEntityFromDto(subjectEntity, subject)
        if (errorMessage != null) {
            return ResponseEntity.badRequest().body(errorMessage)
        }

        subjectService.saveSubject(subjectEntity)
        return ResponseEntity("Successfully created a new subject.", HttpStatus.CREATED)
    }

    @PutMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Updates a subject")
    @ApiResponses(
        value = [ApiResponse(responseCode = "200", description = "Successfully updated subject"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        ), ApiResponse(responseCode = "400", description = "Bad request"), ApiResponse(
            responseCode = "404",
            description = "No existing subject with this id could be found"
        )]
    )
    fun updateSubject(@RequestBody subject: SubjectDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = subject.id ?: return ResponseEntity("Subject id is required", HttpStatus.BAD_REQUEST)

        val subjectEntity = subjectService.getSubject(userId, id) ?: return ResponseEntity(
            "Could not find subject with id $id",
            HttpStatus.NOT_FOUND
        )
        subject.name?.let {
            subjectEntity.name = it
        }
        val errorMessage = updateSubjectEntityFromDto(subjectEntity, subject)
        if (errorMessage != null) {
            return ResponseEntity.badRequest().body(errorMessage)
        }

        subjectService.saveSubject(subjectEntity)
        return ResponseEntity.ok().body("Successfully updated subject")
    }

    @GetMapping("day", produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE])
    @Operation(description = "Gets all subjects for a day of the week. Day must be given as the index of the day of the week, 0 being Sunday, 6 being Saturday")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved subjects"
        ), ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun getSubjectsOnDay(@RequestParam("day") day: Int): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val subjects = subjectService.getAllOnDay(userId, day)
        return ResponseEntity.ok().body(subjects)
    }

    @DeleteMapping(produces = [MediaType.TEXT_PLAIN_VALUE])
    @Operation(description = "Deletes a subject")
    @ApiResponses(
        value = [ApiResponse(responseCode = "200", description = "Successfully deleted a subject"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        ), ApiResponse(responseCode = "404", description = "Subject not found")]
    )
    fun deleteSubject(@RequestParam("id") subjectId: Long): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val deletedCount = subjectService.deleteSubject(userId, subjectId)
        if (deletedCount > 0) {
            return ResponseEntity.ok().body("Successfully deleted a subject")
        }

        return ResponseEntity("Could not find a subject matching id $subjectId", HttpStatus.NOT_FOUND)
    }
}