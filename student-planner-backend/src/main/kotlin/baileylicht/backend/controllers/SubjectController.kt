package baileylicht.backend.controllers

import baileylicht.backend.dtos.SubjectDto
import baileylicht.backend.models.Subject
import baileylicht.backend.repositories.SubjectRepository
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
    @Autowired private val userLoginService: LoginService
) : PlannerItemController<Subject, SubjectRepository, SubjectDto, SubjectService, SubjectDto>(
    subjectService,
    userLoginService
) {
    override fun createItem(@RequestBody dto: SubjectDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = dto.name ?: return ResponseEntity("Subject name is required", HttpStatus.BAD_REQUEST)

        val subjectEntity = Subject(name, user)
        val errorMessage = updateSubjectEntityFromDto(subjectEntity, dto)
        if (errorMessage != null) {
            return ResponseEntity.badRequest().body(errorMessage)
        }

        subjectService.saveItem(subjectEntity)
        return ResponseEntity("Successfully created a new subject.", HttpStatus.CREATED)
    }

    override fun updateItem(@RequestBody dto: SubjectDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = dto.id ?: return ResponseEntity("Subject id is required", HttpStatus.BAD_REQUEST)

        val subjectEntity = subjectService.getItem(userId, id) ?: return ResponseEntity(
            "Could not find subject with id $id",
            HttpStatus.NOT_FOUND
        )
        dto.name?.let {
            subjectEntity.name = it
        }
        val errorMessage = updateSubjectEntityFromDto(subjectEntity, dto)
        if (errorMessage != null) {
            return ResponseEntity.badRequest().body(errorMessage)
        }

        subjectService.saveItem(subjectEntity)
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
}