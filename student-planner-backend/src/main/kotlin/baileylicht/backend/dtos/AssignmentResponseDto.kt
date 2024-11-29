package baileylicht.backend.dtos

data class AssignmentResponseDto(
    val name: String,
    val complete: Boolean,
    val dueDate: String,
    val subject: SubjectDto?,
    val note: String?,
    val id: Long?
) : PlannerItemResponseDto
