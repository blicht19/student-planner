package baileylicht.backend.dtos

data class ExamCreateUpdateDto(
    val name: String?,
    val date: String?,
    val startTime: String?,
    val endTime: String?,
    val subjectId: Long?,
    val location: String?,
    val note: String?,
    val id: Long?
)
