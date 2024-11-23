package baileylicht.backend.dtos

data class AssignmentResponseDto(
    val name: String,
    val complete: Boolean,
    val subject: SubjectDto?,
    val note: String?,
    val dueDate: String?,
    val id: Long?
)
