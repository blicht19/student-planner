package baileylicht.backend.controllers

import baileylicht.backend.dtos.ExamCreateUpdateDto
import baileylicht.backend.dtos.ExamResponseDto
import baileylicht.backend.models.Exam
import baileylicht.backend.repositories.ExamRepository
import baileylicht.backend.services.ExamService
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.SubjectService
import baileylicht.backend.utilities.stringToLocalDate
import baileylicht.backend.utilities.stringToLocalTime
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/exams")
@Tag(name = "Exams")
class ExamController(
    @Autowired private val examService: ExamService,
    @Autowired private val userLoginService: LoginService,
    @Autowired private val subjectService: SubjectService
) : DateRangePlannerItemController<Exam, ExamRepository, ExamResponseDto, ExamService, ExamCreateUpdateDto>(
    examService,
    userLoginService
) {
    override fun createItem(@RequestBody dto: ExamCreateUpdateDto): ResponseEntity<String> {
        val user =
            loginService.getLoggedInUser() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val name = dto.name ?: return ResponseEntity("Exam name is required", HttpStatus.BAD_REQUEST)
        if (dto.date == null) {
            return ResponseEntity("Exam date is required", HttpStatus.BAD_REQUEST)
        }
        val date = stringToLocalDate(dto.date) ?: return ResponseEntity(
            "Invalid date: ${dto.date}",
            HttpStatus.BAD_REQUEST
        )
        if (dto.startTime == null) {
            return ResponseEntity("Exam start time is required", HttpStatus.BAD_REQUEST)
        }
        val startTime = stringToLocalTime(dto.startTime) ?: return ResponseEntity(
            "Invalid start time: ${dto.startTime}",
            HttpStatus.BAD_REQUEST
        )
        if (dto.endTime == null) {
            return ResponseEntity("Exam end time is required", HttpStatus.BAD_REQUEST)
        }
        val endTime = stringToLocalTime(dto.endTime) ?: return ResponseEntity(
            "Invalid end time: ${dto.endTime}",
            HttpStatus.BAD_REQUEST
        )

        if (startTime.isAfter(endTime)) {
            return ResponseEntity("Start time must be before the end time", HttpStatus.BAD_REQUEST)
        }

        val examEntity = Exam(name, date, startTime, endTime, user, location = dto.location, note = dto.note)

        dto.subjectId?.let {
            val subject = subjectService.getItem(user.id!!, it)
                ?: return ResponseEntity("Could not find subject matching id $it", HttpStatus.BAD_REQUEST)
            examEntity.subject = subject
        }

        examService.saveItem(examEntity)
        return ResponseEntity.ok("Successfully created a new exam")
    }

    override fun updateItem(@RequestBody dto: ExamCreateUpdateDto): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val id = dto.id ?: return ResponseEntity("Exam id is required", HttpStatus.BAD_REQUEST)
        val examEntity = examService.getItem(userId, id) ?: return ResponseEntity(
            "Could not find exam with id $id",
            HttpStatus.NOT_FOUND
        )

        dto.name?.let { examEntity.name = it }
        dto.date?.let {
            val date = stringToLocalDate(it) ?: return ResponseEntity("Invalid date: $it", HttpStatus.BAD_REQUEST)
            examEntity.date = date
        }
        dto.startTime?.let {
            val startTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid start time: $it", HttpStatus.BAD_REQUEST)
            examEntity.startTime = startTime
        }
        dto.endTime?.let {
            val endTime =
                stringToLocalTime(it) ?: return ResponseEntity("Invalid end time: $it", HttpStatus.BAD_REQUEST)
            examEntity.endTime = endTime
        }
        dto.subjectId?.let {
            if (it < 1) {
                examEntity.subject = null
            } else {
                val subject = subjectService.getItem(userId, it) ?: return ResponseEntity(
                    "Could not find subject matching id $it",
                    HttpStatus.BAD_REQUEST
                )
                examEntity.subject = subject
            }

        }
        dto.location?.let {
            if (it.isBlank()) {
                examEntity.location = null
            } else {
                examEntity.location = it
            }
        }
        dto.note?.let {
            if (it.isBlank()) {
                examEntity.note = null
            } else {
                examEntity.note = it
            }
        }

        if (examEntity.startTime.isAfter(examEntity.endTime)) {
            return ResponseEntity("Start time must be before the end time", HttpStatus.BAD_REQUEST)
        }

        examService.saveItem(examEntity)
        return ResponseEntity.ok("Successfully updated exam")
    }
}