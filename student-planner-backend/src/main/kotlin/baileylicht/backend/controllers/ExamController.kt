package baileylicht.backend.controllers

import baileylicht.backend.dtos.DateRangeDto
import baileylicht.backend.dtos.ExamCreateUpdateDto
import baileylicht.backend.models.Exam
import baileylicht.backend.services.ExamService
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.SubjectService
import baileylicht.backend.utilities.stringToLocalDate
import baileylicht.backend.utilities.stringToLocalTime
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
@RequestMapping("/exams")
@Tag(name = "Exams")
class ExamController(
    @Autowired private val examService: ExamService,
    @Autowired private val loginService: LoginService,
    @Autowired private val subjectService: SubjectService
) {
    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Retrieves all exams for this user")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved exams"
        ), ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun getAllExams(): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val exams = examService.getAll(userId)
        return ResponseEntity.ok(exams)
    }

    @PostMapping(
        produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        path = ["range"]
    )
    @Operation(summary = "Gets all exams in a range of dates")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved exams"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        )]
    )
    fun getAllExamsInDateRange(@RequestBody range: DateRangeDto): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val startDate =
            stringToLocalDate(range.startDate) ?: return ResponseEntity("Invalid start date", HttpStatus.BAD_REQUEST)
        if (range.endDate != null) {
            val endDate =
                stringToLocalDate(range.endDate) ?: return ResponseEntity("Invalid end date", HttpStatus.BAD_REQUEST)
            return ResponseEntity.ok(examService.getAllInDateRange(userId, startDate, endDate))
        }

        return ResponseEntity.ok(examService.getAllOnDate(userId, startDate))
    }

    @PostMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Creates a new exam")
    @ApiResponses(
        value = [ApiResponse(responseCode = "201", description = "Successfully created a new exam"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        ), ApiResponse(responseCode = "400", description = "Bad request")]
    )
    fun createExam(@RequestBody exam: ExamCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = exam.name ?: return ResponseEntity("Exam name is required", HttpStatus.BAD_REQUEST)
        if (exam.date == null) {
            return ResponseEntity("Exam date is required", HttpStatus.BAD_REQUEST)
        }
        val date = stringToLocalDate(exam.date) ?: return ResponseEntity(
            "Invalid date: ${exam.date}",
            HttpStatus.BAD_REQUEST
        )
        if (exam.startTime == null) {
            return ResponseEntity("Exam start time is required", HttpStatus.BAD_REQUEST)
        }
        val startTime = stringToLocalTime(exam.startTime) ?: return ResponseEntity(
            "Invalid start time: ${exam.startTime}",
            HttpStatus.BAD_REQUEST
        )
        if (exam.endTime == null) {
            return ResponseEntity("Exam end time is required", HttpStatus.BAD_REQUEST)
        }
        val endTime = stringToLocalTime(exam.endTime) ?: return ResponseEntity(
            "Invalid end time: ${exam.endTime}",
            HttpStatus.BAD_REQUEST
        )
        val examEntity = Exam(name, date, startTime, endTime, user, location = exam.location, note = exam.note)

        exam.subjectId?.let {
            val subject = subjectService.getSubject(user.id!!, it)
                ?: return ResponseEntity("Could not find subject matching id $it", HttpStatus.BAD_REQUEST)
            examEntity.subject = subject
        }

        examService.saveExam(examEntity)
        return ResponseEntity.ok("Successfully created a new exam")
    }

    @PutMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Updates an exam")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully updated assignment"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        ), ApiResponse(responseCode = "404", description = "No existing exam with this id could be found")]
    )
    fun updateExam(@RequestBody exam: ExamCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = exam.id ?: return ResponseEntity("Exam id is required", HttpStatus.BAD_REQUEST)
        val examEntity = examService.getExam(userId, id) ?: return ResponseEntity(
            "Could not find exam with id $id",
            HttpStatus.NOT_FOUND
        )

        exam.name?.let { examEntity.name = it }
        exam.date?.let {
            val date = stringToLocalDate(it) ?: return ResponseEntity("Invalid date: $it", HttpStatus.BAD_REQUEST)
            examEntity.date = date
        }
        exam.startTime?.let {
            val startTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid start time: $it", HttpStatus.BAD_REQUEST)
            examEntity.startTime = startTime
        }
        exam.endTime?.let {
            val endTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid end time: $it", HttpStatus.BAD_REQUEST)
            examEntity.endTime = endTime
        }
        exam.subjectId?.let {
            if (it < 1) {
                examEntity.subject = null
            } else {
                val subject = subjectService.getSubject(userId, it) ?: return ResponseEntity(
                    "Could not find subject matching id $it",
                    HttpStatus.BAD_REQUEST
                )
                examEntity.subject = subject
            }

        }
        exam.location?.let {
            if (it.isBlank()) {
                examEntity.location = null
            } else {
                examEntity.location = it
            }
        }
        exam.note?.let {
            if (it.isBlank()) {
                examEntity.note = null
            } else {
                examEntity.note = it
            }
        }

        examService.saveExam(examEntity)
        return ResponseEntity.ok("Successfully updated exam")
    }

    @DeleteMapping(produces = [MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Deletes an exam")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully deleted an exam"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "404",
            description = "Exam not found"
        )]
    )
    fun deleteExam(@RequestParam("id") examId: Long): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val deletedCount = examService.deleteExam(userId, examId)
        if (deletedCount > 0) {
            return ResponseEntity.ok().body("Successfully deleted an exam")
        }

        return ResponseEntity("Could not find an exam matching id $examId", HttpStatus.NOT_FOUND)
    }
}