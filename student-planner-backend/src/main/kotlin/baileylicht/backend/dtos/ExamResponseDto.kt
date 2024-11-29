package baileylicht.backend.dtos

data class ExamResponseDto(
    val name: String,
    val date: String,
    val startTime: String,
    val endTime: String,
    val subject: SubjectDto?,
    val location: String?,
    val note: String?,
    val id: Long?
) : PlannerItemResponseDto
